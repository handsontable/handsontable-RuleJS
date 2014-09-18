(function (Handsontable) {
  'use strict';

  function HandsontableFormula() {

    var instance,
        pluginEnabled = false;

    var formulaRenderer = function (instance, TD, row, col, prop, value, cellProperties) {

      // translate coordinates into cellId
      var cellId = instance.ruleJS.utils.translateCellCoords({row: row, col: col + 1}),
          formula = null;

      // clear item in matrix
      instance.ruleJS.matrix.removeItem(cellId);

      // check if typed formula
      if (value && value[0] === '=') {
        formula = value.substr(1);

        // define item to rulesJS matrix
        var item = {
          id: cellId,
          formula: formula
        };

        // add item to matrix
        var addedItem = instance.ruleJS.matrix.addItem(item);

        // parse formula
        var newValue = instance.ruleJS.parse(formula, {row: row, col: col});

        // update item value and error
        instance.ruleJS.matrix.updateItem(addedItem, {value: newValue.result, error: newValue.error});

        // update cell value in hot
        value = newValue.result || newValue.error;

        TD.style.backgroundColor = 'yellow';
      }

      // set formula meta for cell
      instance.setCellMetaObject(row, col, {formula: formula});

      // apply changes
      textCell.renderer.apply(this, [instance, TD, row, col, prop, value, cellProperties]);
    };

    var formulaCell = {
      renderer: formulaRenderer,
      editor: Handsontable.editors.TextEditor,
      dataType: 'formula'
    };

    var textCell = {
      renderer: Handsontable.renderers.TextRenderer,
      editor: Handsontable.editors.TextEditor
    };

    this.init = function (source) {
      instance = this;
      pluginEnabled = !!instance.getSettings().formulas;

      if (pluginEnabled) {

        var custom = {
          cellValue: instance.getDataAtCell
        };

        instance.ruleJS = new ruleJS();
        instance.ruleJS.init();

        instance.ruleJS.custom = custom;

        Handsontable.cellTypes['formula'] = formulaCell;
        Handsontable.TextCell.renderer = formulaRenderer;
      }
    };
  }

  var htFormula = new HandsontableFormula();

  Handsontable.hooks.add('beforeInit', htFormula.init);

})(Handsontable);