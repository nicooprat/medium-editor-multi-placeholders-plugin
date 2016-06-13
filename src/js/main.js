var MediumEditorMultiPlaceholders = MediumEditor.Extension.extend({
  name: 'multi_placeholder',
  init:  function() {
    this.updateAllPlaceholders();
    this.watchChanges();
  },

  destroy: function () {
    this.getEditorElements().forEach(function (editor) {
      // Get array of HTMLCollection: top-level placeholders of current editor
      var children = [].slice.call(editor.querySelectorAll('[data-placeholder]'));

      // Remove every placeholder
      children.map(function(el) {
        el.remove();
      }, this);
    }, this);
  },

  updateAllPlaceholders: function() {
    this.getEditorElements().forEach(function(editor) {
      // Get array of HTMLCollection: top-level children of current editor
      var children = [].slice.call(editor.children);

      // Children array must be at least as long as the placeholders:
      // so if child is missing, we can create the placeholder instead,
      // using the 'fake' keyword to distinguish only
      while( children.length < this.placeholders.length ) {
        children.push('fake');
      }

      // Loop through all children elements
      children.forEach(function(child, i) {
        // Get corresponding placeholder specified in the extension options
        var placeholder = this.placeholders[i];

        // If a corresponding placeholder exists
        if( placeholder ) {
          // If a real HTML element is present
          if( child !== 'fake' ) {
            // If tagName matches (ie. user has not edited it yet)
            if( child.tagName.toLowerCase() === placeholder.tag ) {
              // If the element is empty
              if( child.textContent.trim() === '' ) {
                // Fill and show the placeholder text
                child.setAttribute('data-placeholder', placeholder.text);
                child.classList.add('medium-editor-placeholder');
              // If element has text
              } else {
                // Empty and hide the placeholder text
                child.removeAttribute('data-placeholder');
                child.classList.remove('medium-editor-placeholder');
              }
            }
          // If no actual HTML element
          } else {
            // Create the placeholder element, and append to the editor
            var element = document.createElement(placeholder.tag);
            element.innerHTML = '<br>';
            element.setAttribute('data-placeholder', placeholder.text);
            element.classList.add('medium-editor-placeholder');
            editor.appendChild(element);
          }
        // If no corresponding placeholder has been specified
        } else {
          // Empty and hide the placeholder text
          child.removeAttribute('data-placeholder');
          child.classList.remove('medium-editor-placeholder');
        }
      }, this);
    }, this);
  },

  handleKeydownEnter: function(e, element) {
    var selection = window.getSelection(),
        editor = this,
        current = selection.getRangeAt(0).commonAncestorContainer,
        parent = current;

    // Climb through parent elements to the find top-level parent
    if( parent.parentNode != element ) {
      while (parent.parentNode) {
        if (parent.parentNode == element) {
          break;
        } else {
          parent = parent.parentNode;
        }
      }
    }

    // Get next sibling
    var next = parent.nextSibling;

    // If next top-level element is an empty placeholder,
    // prevent from creating a new line, and focus the next sibling placeholder
    if( next && next.classList.contains('medium-editor-placeholder') ) {
      // Only if cursor is at the end of line
      if( selection.focusOffset >= parent.textContent.length ) {
        // Prevent [enter]
        e.preventDefault();

        // Prepare new selection
        var range = document.createRange();
        range.setStart(next, 0);
        range.collapse(true);

        // Apply new selection
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  },

  watchChanges: function() {
    this.subscribe('editableKeydownEnter', this.handleKeydownEnter.bind(this));
    this.subscribe('editableInput', this.updateAllPlaceholders.bind(this));
    this.subscribe('externalInteraction', this.updateAllPlaceholders.bind(this));
  }
});
