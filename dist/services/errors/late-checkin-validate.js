"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/services/errors/late-checkin-validate.ts
var late_checkin_validate_exports = {};
__export(late_checkin_validate_exports, {
  LateCheckInValidate: () => LateCheckInValidate
});
module.exports = __toCommonJS(late_checkin_validate_exports);
var LateCheckInValidate = class extends Error {
  constructor() {
    super("The checkIn can only be validated until 20 minutes!");
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  LateCheckInValidate
});
