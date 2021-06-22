(function () {
    class BiScript extends HTMLElement {

        constructor() {
            super();
        }

        evaluate(script) {
            return new Function(script)();
        }

    }
    customElements.define("com-biexcellence-openbi-sap-sac-script", BiScript);
})();
