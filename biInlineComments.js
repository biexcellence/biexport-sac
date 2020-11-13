(function () {
    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
      </style>
      <div id="inlinecomment_div" name="inlinecomment_div">
      <table class="sapEpmUiControlCrosstab">
        <thead></thead>
        <tbody></tbody>
      </table>
      </div>
    `;

    class biInlineComments extends HTMLElement {

        constructor() {
            super();

            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this.widgetId = "";
            this.inlineStyle = "";
            this.legendStyle = "";
            this.data = "";
            this._comments = [];
            this._values = [];

            this._metadata = getMetadata();

        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        // SETTINGS

        getWidgetID() {
            return this.widgetId;
        }
        setWidgetID(value) {
            var lkey = "";
            for (var key in this._metadata.components) {
                if (this._metadata.components[key].name == value) {
                    this._setValue("widgetId", key);
                    lkey = key;
                    break;
                }
            }
            if (lkey == "") {
                this._setValue("widgetId", value);
            }
        }

        getInlineStlye() {
            return this.inlineStyle;
        }
        setInlineStlye(value) {
            this._setValue("inlineStyle", value);
        }

        getLegendStlye() {
            return this.legendStyle;
        }
        setLegendStlye(value) {
            this._setValue("legendStyle", value);
        }
        // METHODS

        _setValue(name, value) {
            this[name] = value;

            let properties = {};
            properties[name] = this[name];
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: properties
                }
            }));
        }

        getSelectedRow(selection) {
            var lrow = 0;
            var lcol = 0;

            if (selection == null) {
                return 0;
            }

            let ldata = this._metadata.components[this.widgetId].data;

            for (var y = 0; y < ldata.length; y++) {
                for (var x = 0; x < ldata[y].length; x++) {
                    let lcell = ldata[y][x].cellMemberContext;

                    if (lcell != null) {
                        var lmatch = true;
                        for (var key in lcell) {
                            if (selection[key] != null) {
                                // first try - full match
                                if (selection[key] != lcell[key].id) {
                                    lmatch = false;
                                    break;
                                }
                            } else {
                                // second try - @MeasureDimension
                                if (selection["@MeasureDimension"] != lcell[key].id) {
                                    lmatch = false;
                                    break;
                                }
                            }
                        }

                        if (lmatch) {
                            lrow = y;
                            lcol = x;
                            break;
                        }
                    }

                }

                if (lrow > 0 && lcol > 0) { break; }
            }

            return lrow;

        }

        commentCell(comment, commentindex, row, column, overwrite) {
            // determine commentindex if needed
            if (commentindex == 0) {
                commentindex = this._comments.length + 1;
            }

            // update data
            var lrow = {};
            lrow.widget = "";
            lrow.comment = comment;
            lrow.index = commentindex;
            lrow.rowNumber = row;
            lrow.columnNumber = column;
            this._comments.push(lrow);

            // get Table Widget CELL
            let ltablecell = this._getTableCell(lrow);

            // update Table Widget CELL
            this._updateTableCell(ltablecell, lrow, overwrite);

            // update Comment BODY
            this._updateCommentBody(lrow);

        }

        commentWidget(comment, commentindex, widget) {
            var lwidget = widget;
            var ltype = "";

            for (var key in this._metadata.components) {
                if (this._metadata.components[key].name == widget) {
                    lwidget = key;
                    ltype = this._metadata.components[key].type;
                }
            }

            // determine commentindex if needed
            if (commentindex == 0) {
                commentindex = this._comments.length + 1;
            }

            // update data
            var lrow = {};
            lrow.widget = lwidget;
            lrow.comment = comment;
            lrow.index = commentindex;
            this._comments.push(lrow);

            // update Table Widget
            this._updateWidget(ltype, lrow);

            // update Comment BODY
            this._updateCommentBody(lrow);

        }

        overwriteCell(value, row, column) {
            // update data
            var lrow = {};
            lrow.newvalue = value;
            lrow.originalValue = "";
            lrow.rowNumber = row;
            lrow.columnNumber = column;
            this._values.push(lrow);

            // get Table Widget CELL
            let ltablecell = this._getTableCell(lrow);

            // update Table Widget CELL
            this._updateTableCell(ltablecell, lrow);

        }

        highlightCell(style, row, column) {
            // update data
            var lrow = {};
            lrow.style = value;
            lrow.rowNumber = row;
            lrow.columnNumber = column;
            this._highlights.push(lrow);

            // get Table Widget CELL
            let ltablecell = this._getTableCell(lrow);

            // update Table Widget CELL
            this._updateTableCell(ltablecell, lrow);

        }

        overwriteUnbookedCells() {
            let ltable;
            if (this.widgetId.indexOf("__widget" == -1)) {
                ltable = document.querySelector('[data-sap-widget-id="' + this.widgetId + '"]>div');
            } else {
                ltable = document.querySelector("#" + this.widgetId + ">div");
            }

            let lunbooked = ltable.querySelectorAll('.unbooked');
            for (var i = 0; i < lunbooked.length; i++ ) {

                let lsvg = lunbooked[i].querySelector("svg");
                if (lsvg != null) {
                    lunbooked[i].removeChild(lsvg);
                    lunbooked[i].appendChild(document.createTextNode("n.a."));
                }
            }
 
        }

        _getTableCell(irow) {
            let ltable;
            if (this.widgetId.indexOf("__widget" == -1)) {
                ltable = document.querySelector('[data-sap-widget-id="' + this.widgetId + '"]>div');
            } else {
                ltable = document.querySelector("#" + this.widgetId + ">div");
            }

            // get tablecell
            let tablecell = ltable.querySelector('[data-col="' + irow.columnNumber + '"][data-row="' + irow.rowNumber + '"]');
            if (tablecell == null) {
                tablecell = ltable.querySelector('[data-tablecol="' + irow.columnNumber + '"][data-tablerow="' + irow.rowNumber + '"]');
            }

            return tablecell;
        }

        _updateTableCell(itablecell, irow, overwrite) {
            if (itablecell != null) {
                itablecell.setAttribute("data-disable-number-formatting", "X");
                for (var i = 0; i < itablecell.childNodes.length; i++) {
                    if (itablecell.childNodes[i].nodeType == 3) {
                        // overwrite values
                        if (irow.newValue !== null) {
                            irow.originalValue = itablecell.childNodes[i].nodeValue;
                            itablecell.childNodes[i].nodeValue = irow.newValue;
                            itablecell.setAttribute("title", irow.newValue);
                        }

                        // comments
                        if (irow.index !== null) {
                            var larray = [];
                            for (var j = 0; j < this._comments.length; j++) {
                                if (this._comments[j].rowNumber == irow.rowNumber && this._comments[j].columnNumber == irow.columnNumber) {
                                    larray.push(this._comments[j].index);
                                }
                            }

                            var ltext = "";
                            if (!overwrite) {
                                ltext = itablecell.childNodes[i].nodeValue & " " & larray.join(", ");
                            } else {
                                ltext = larray.join(", ");                            
                            }
                            
                            itablecell.childNodes[i].nodeValue = ltext;
                            itablecell.setAttribute("title", ltext);
                        }

                    }
                }

                // highlights
                if (irow.style !== null) {
                    itablecell.childNodes[i].style.backgroundcolor = irow.style;
                }

                if (ioverwrite) {
                    if (itablecell.nextSibling != null) {
                        itablecell.style.color = itablecell.nextSibling.style.color
                    } else {
                       itablecell.style.color = "rgb(51, 51, 51)";
                    }
                }
            }
        }

        _updateWidget(itype, irow) {
            let lwidget = document.querySelector('[data-sap-widget-id="' + this.widgetId + '"]>div');

            if (lwidget != null) {
                        // comments
                        if (irow.index !== null) {
                            var larray = [];
                            for (var j = 0; j < this._comments.length; j++) {
                                if (this._comments[j].widget == irow.widget) {
                                    larray.push(this._comments[j].index);
                                }
                            }

                            switch (itype) {
                                case "text":
                                lwidget.textContent = lwidget.textContent & " " & larray.join(", ");
                                lwidget.setAttribute("title", lwidget.textContent);
                                break;
                            }

                        }

            }
        }

        _updateCommentBody(irow) {
            let table = this._shadowRoot.querySelector("#inlinecomment_div >table");
            let tbody = table.children[1];

            let tr = document.createElement("tr");

            let td1 = document.createElement("td");
            td1.setAttribute("class", "default defaultTableCell generalCell hideBorder generalCell dimMember rowDimMemberCell generalCell sapDimMemberCellHeading")
            td1.setAttribute("style", "font-size: 11px; line-height: 12px; color: rgb(0, 0, 0); fill: rgb(0, 0, 0); font-family: arial; background-color: transparent; vertical-align: middle;font-weight:bold;max-width:30px;");
            td1.textContent = irow.index;
            td1.setAttribute("title", irow.index);
            tr.appendChild(td1);

            let td2 = document.createElement("td");
            td2.setAttribute("class", "default defaultTableCell generalCell hideBorder generalCell dimMember rowDimMemberCell generalCell sapDimMemberCellHeading")
            td2.setAttribute("style", "font-size: 11px; line-height: 12px; color: rgb(0, 0, 0); fill: rgb(0, 0, 0); font-family: arial; background-color: transparent; vertical-align: middle;max-width:100%;");
            td2.textContent = irow.comment;
            td2.setAttribute("title", irow.comment);
            tr.appendChild(td2);

            tbody.appendChild(tr);

        }

        clearCellValues() {
            this._values = [];
        }

        clearCellHighlights() {
            this._highlights = [];
        }

        clearWidgetComments(widget) {
            this._comments = [];
        }

        clearCellComments() {
            this._comments = [];

            let table = this._shadowRoot.querySelector("#inlinecomment_div >table");
            let thead = table.children[0];
            let tbody = table.children[1];

            while (thead.firstChild) {
                thead.removeChild(thead.lastChild)
            }
            while (tbody.firstChild) {
                tbody.removeChild(tbody.lastChild)
            }

        }

    }
    customElements.define("com-biexcellence-openbi-sap-sac-biinlinecomments", biInlineComments);

    // UTILS

    const contentDispositionFilenameRegExp = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i;

    function getMetadata() {
        let shell = commonApp.getShell();
        let documentContext = shell.findElements(true, e => e.getMetadata().hasProperty("resourceType") && e.getProperty("resourceType") == "STORY")[0].getDocumentContext();
        let storyModel = documentContext.get("sap.fpa.story.getstorymodel");
        let entityService = documentContext.get("sap.fpa.bi.entityService");
        let widgetControls = documentContext.get("sap.fpa.story.document.widgetControls");

        let components = {};
        storyModel.getAllWidgets().forEach((widget) => {
            if (widget) { // might be undefined during edit
                let component = {
                    type: widget.class
                }

                let widgetControl = widgetControls.filter((control) => control.getWidgetId() == widget.id)[0];
                if (widgetControl) { // control specific stuff
                    if (typeof widgetControl.getTableController == "function") { // table
                        let tableController = widgetControl.getTableController();
                        if (tableController !== null) {
                        let regions = tableController.getDataRegions();

                        try {
                            let cells = regions[0].getCells();
                            component.data = cells.map((row) => row.map((cell) => cell.getJSON()));
                        }
                        catch (e) {
                        }
                        }
                    }
                }

                components[widget.id] = component;
            }
        });
        let datasources = {};
        entityService.getDatasets().forEach((datasetId) => {
            let dataset = entityService.getDatasetById(datasetId);
            datasources[datasetId] = {
                name: dataset.name,
                description: dataset.description,
                model: dataset.model
            };

            storyModel.getWidgetsByDatasetId(datasetId).forEach((widget) => {
                components[widget.id].datasource = datasetId;
            });
        });

        let result = {
            components: components,
            datasources: datasources
        }

        // only for applications (not stories)
        let app;

        let applicationEntity = storyModel.getApplicationEntity();
        if (applicationEntity) {
            app = applicationEntity.app;
        }

        let outlineContainer = shell.findElements(true, e => e.hasStyleClass && e.hasStyleClass("sapAppBuildingOutline"))[0]; // sId: "__container0"
        if (outlineContainer) { // outlineContainer has more recent data than applicationEntity during edit
            try {
                app = outlineContainer.getReactProps().store.getState().globalState.instances.app["[{\"app\":\"MAIN_APPLICATION\"}]"];
            } catch (e) { /* ignore */ }
        }

        if (app) {
            let names = app.names;

            for (let key in names) {
                let name = names[key];

                let obj = JSON.parse(key).pop();
                let type = Object.keys(obj)[0];
                let id = obj[type];

                let component = components[id];
                if (component) { // might be undefined during edit
                    component.type = type;
                    component.name = name;
                }
            }

            result.vars = app.globalVars;
        }

        return result;
    }

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

})();