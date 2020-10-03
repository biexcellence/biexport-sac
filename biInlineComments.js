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
            this._data = [];

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
            var lmetadata = getMetadata();
            for (var i = 0; i < lmetadata.components.length; i++) {
                // if (lmetadata.components[i] = 
            }
            this._setValue("widgetId", value);
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

        addCommentByNumber(comment, commentindex, row, column) {
            var lrow = {};
            lrow.comment = comment;
            lrow.index = commentindex;
            lrow.rowNumber = row;
            lrow.columnNumber = column;           
            this._data.push(lrow);

            let table = this._shadowRoot.querySelector("#inlinecomment_div >table");
            let tbody = table.children[1];

            let tablecell;
            tablecell = document.querySelector("#" + this.widgetId + ">div").querySelector('[data-col="' + column + '"][data-row="' + row + '"]');
            // fallback for other table rendering
            if (tablecell == null) {
                tablecell = document.querySelector("#" + this.widgetId + ">div").querySelector('[data-tablecol="' + column + '"][data-tablerow="' + row + '"]');
            }
            if (tablecell != null) {
                for (var i = 0; i < tablecell.childNodes.length; i++) {
                    if (tablecell.childNodes[i].nodeType == 3) {
                        var larray = [];
                        for (var j = 0; j < this._data.length; j++) {
                            if (this._data[j].rowNumber == lrow.rowNumber && this._data[j].columnNumber == lrow.columnNumber) {
                                larray.push(this._data[j].commentindex);
                            }
                        }
                        tablecell.childNodes[i].nodeValue = larray.join(", "); // commentindex.toString();
                    }
                }
                if (tablecell.nextSibling != null) {
                    tablecell.style.color = tablecell.nextSibling.style.color
                } else {
                    tablecell.style.color = "rgb(51, 51, 51)";
                }
            }

            let tr = document.createElement("tr");

            let td1 = document.createElement("td");
            td1.setAttribute("class", "default defaultTableCell generalCell hideBorder generalCell dimMember rowDimMemberCell generalCell sapDimMemberCellHeading")
            td1.textContent = commentindex;
            tr.appendChild(td1);

            let td2 = document.createElement("td");
            td2.setAttribute("class", "default defaultTableCell generalCell hideBorder generalCell dimMember rowDimMemberCell generalCell sapDimMemberCellHeading")
            td2.textContent = comment;
            tr.appendChild(td2);

            tbody.appendChild(tr);
        }

        addCommentById(comment, index, rowId, columnId) {
            var lrow = {};
            lrow.comment = comment;
            lrow.index = index;
            lrow.rowId = rowId;
            lrow.columnId = columnId;
            this._data.push(lrow);

        }

        clearComments() {
            this._data = [];

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
                        let tableControler = widgetControl.getTableController();
                        let regions = tableControler.getDataRegions();
                        let cells = regions[0].getCells();

                        component.data = cells.map((row) => row.map((cell) => cell.getJSON()));
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