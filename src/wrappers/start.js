(function (root, factory) {
  'use strict';
  if (typeof module === 'object') {
    module.exports = factory(require("medium-editor"));
  } else if (typeof define === 'function' && define.amd) {
    define(["medium-editor"], factory);
  } else {
    root.MediumEditorMultiPlaceholders = factory(root.MediumEditor);
  }
}(this, function (MediumEditor) {
  'use strict';
