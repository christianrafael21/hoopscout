"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = schemaValidator;
function schemaValidator(schema) {
    return (req, res, next) => {
        var _a;
        const validation = schema.validate(req.body);
        if (validation.error) {
            throw { type: "Unprocessable Entity", message: (_a = validation.error.details[0].context) === null || _a === void 0 ? void 0 : _a.label };
        }
        next();
    };
}
