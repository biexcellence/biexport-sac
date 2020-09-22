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

            let table = this._shadowRoot.querySelector("#inlinecomment_div >table");
            let tbody = table.children[1];

            let tablecell;
                tablecell = document.querySelector("#__widget0>div").querySelector('[data-col="' & columnId & '"][data-row="' & rowId & '"]');
            if (tablecell != null) {
                ltablecell.textContent = index;
            }

            let tr = document.createElement("tr");

            let td1 = document.createElement("td");
            td1.setAttribute("class", "default defaultTableCell generalCell hideBorder generalCell dimMember rowDimMemberCell generalCell sapDimMemberCellHeading")
            td1.TextContent = index;
            tr.appendChild(td1);

            let td2 = document.createElement("td");
            td2.setAttribute("class", "default defaultTableCell generalCell hideBorder generalCell dimMember rowDimMemberCell generalCell sapDimMemberCellHeading")
            td2.TextContent = comment;
            tr.appendChild(td2);

            tbody.appendChild(tr);

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
                tbody.removeChild(thead.lastChild)
            }

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