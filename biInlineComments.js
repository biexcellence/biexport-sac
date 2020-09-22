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

            debugger;

            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));

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
            debugger;
            let table = this._shadowRoot.querySelector("#inlinecomment_div").firstChild;
            let thead = table.childNodes[0];
            let tbody = table.childNodes[1];

            if (this._data.length > 0) {

                //let header1 = document.createElement("th");
                //header1.TextContent = "Note"

                //let header2 = document.createElement("th");
                //header2.TextContent = "Comment"

                for (i = 0; i < this._data.length; i++) {

                    let tablecell;
                    if (this._data[i].columnNumber != null) {
                        tablecell = document.querySelector("#__widget0>div").querySelector('[data-col="' & this._data[i].columnNumber & '"][data-row="' & this._data[i].rowNumber & '"]');
                    }
                    if (tablecell != null) {
                        ltablecell.textContent = this._data[i].index;
                    }
                    
                    let tr = document.createElement("tr");

                    let td1 = document.createElement("td");
                    td1.setAttribute("class", "default defaultTableCell generalCell hideBorder generalCell dimMember rowDimMemberCell generalCell sapDimMemberCellHeading")
                    td1.TextContent = this._data[i].index;
                    tr.appendChild(td1);

                    let td2 = document.createElement("td");
                    td2.setAttribute("class", "default defaultTableCell generalCell hideBorder generalCell dimMember rowDimMemberCell generalCell sapDimMemberCellHeading")
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
            lrow.rowNumber = row;
            lrow.columnNumber = column;           
            this._data.push(lrow);
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
            this._updateSettings();
        }

    }
    customElements.define("com-biexcellence-openbi-sap-sac-biinlinecomments", biInlineComments);

    // UTILS

    const contentDispositionFilenameRegExp = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i;

    function createGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            let r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

})();