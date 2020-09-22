(function () {
    let tmpl = document.createElement("template");
    tmpl.innerHTML = `
      <style>
      </style>
      <div id="inlinecomment_div" name="inlinecomment_div">
      <table>
        <thead></thead>
        <tbody></tbody>
      </table>
      </div>
    `;

    class inlineComments extends HTMLElement {

        constructor() {
            super();

            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

            this._id = createGuid();

            this._shadowRoot.querySelector("#inlinecomment_div").id = this._id + "inlinecomment_div";

            this._widgetId = "";
            this._inlineStyle = "";
            this._legendStyle = "";
            this._data = [];

        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            if ("designMode" in changedProperties) {
                this._designMode = changedProperties["designMode"];
            }
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            let thead = this._shadowRoot.querySelector("#inlinecomment_div").firstChild..childNodes(0);
            let tbody = this._shadowRoot.querySelector("#inlinecomment_div").firstChild.childNodes(1);

            debugger;

            if (this._data.length > 0) {

                'let header1 = document.createElement("th");
                'header1.TextContent = "Note"

                'let header2 = document.createElement("th");
                'header2.TextContent = "Comment"

                for (i = 0; i < this._data.length) {

                    let tablecell = document.querySelector("#__widget0>div").querySelector('[data-col="' & this._data[i].column & '"][data-row="' & this._data[i].row & '"]');
                    if (tablecell != null) {
                        ltablecell.textContent = this._data[i].index;
                    }
                    
                    let tr = document.createElement("tr");

                    let td1 = document.createElement("td");
                    td1.TextContent = this._data[i].index;
                    tr.appendChild(td1);

                    let td2 = document.createElement("td");
                    td2.TextContent = this._data[i].comment;
                    tr.appendChild(td2);

                    tbody.appendChild(tr);

                }
            }

        }

        // SETTINGS

        getWidgetID() {
            return this.widgetId;
        }
        setWidgetID(value) {
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

        addCommentByNumber(comment, index, row, column) {
            var lrow = {};
            lrow.comment = comment;
            lrow.index = index;
            lrow.row = row;
            lrow.column = column;           
            this._data.push(lrow);
        }

        addCommentById(comment, index, rowId, columnId) {
            var lrow = {};
            lrow.comment = comment;
            lrow.index = index;
            lrow.row = rowId;
            lrow.column = columnId;
            this._data.push(lrow);
        }

        clearComments() {
            this._data = [];
            this._updateSettings();
        }

    }
    customElements.define("com-biexcellence-openbi-sap-sac-inlineComments", inlineComments);

    // UTILS

    const contentDispositionFilenameRegExp = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i;

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

})();