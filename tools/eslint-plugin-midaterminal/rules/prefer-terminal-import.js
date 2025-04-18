module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce using terminal components from the barrel export",
      category: "Best Practices",
      recommended: true,
    },
    fixable: "code",
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        // Check if importing directly from Terminal component files
        if (
          node.source.value.includes("/components/Terminal/") &&
          !node.source.value.endsWith("/index")
        ) {
          context.report({
            node,
            message: "Import Terminal components from the barrel export",
            fix(fixer) {
              return fixer.replaceText(
                node.source,
                "'../../components/Terminal'",
              );
            },
          });
        }
      },
    };
  },
};
