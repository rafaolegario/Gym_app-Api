"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/services/validate-check-in-service.ts
var validate_check_in_service_exports = {};
__export(validate_check_in_service_exports, {
  ValidateCheckInService: () => ValidateCheckInService
});
module.exports = __toCommonJS(validate_check_in_service_exports);

// src/services/errors/resource-not-found.ts
var ResourceNotFound = class extends Error {
  constructor() {
    super("Resource not found!");
  }
};

// src/services/validate-check-in-service.ts
var import_dayjs = __toESM(require("dayjs"));

// src/services/errors/late-checkin-validate.ts
var LateCheckInValidate = class extends Error {
  constructor() {
    super("The checkIn can only be validated until 20 minutes!");
  }
};

// src/services/validate-check-in-service.ts
var ValidateCheckInService = class {
  constructor(checkInsRepository) {
    this.checkInsRepository = checkInsRepository;
  }
  async execute({
    checkIn_id
  }) {
    const checkIn = await this.checkInsRepository.findById(checkIn_id);
    if (!checkIn) {
      throw new ResourceNotFound();
    }
    const distanceInMinutesFromCheckInCreation = (0, import_dayjs.default)(/* @__PURE__ */ new Date()).diff(
      checkIn.created_at,
      "minutes"
    );
    const MaxMinValidation = 20;
    if (distanceInMinutesFromCheckInCreation > MaxMinValidation) {
      throw new LateCheckInValidate();
    }
    checkIn.is_validated = /* @__PURE__ */ new Date();
    await this.checkInsRepository.save(checkIn);
    return { checkIn };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ValidateCheckInService
});
