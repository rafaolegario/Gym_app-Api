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

// src/services/register-service.ts
var register_service_exports = {};
__export(register_service_exports, {
  RegisterService: () => RegisterService
});
module.exports = __toCommonJS(register_service_exports);
var import_bcryptjs = require("bcryptjs");

// src/services/errors/user-already-exists.ts
var UserAlreadyExists = class extends Error {
  constructor() {
    super("E-mail already exists");
  }
};

// src/services/register-service.ts
var RegisterService = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute({
    name,
    email,
    password
  }) {
    const password_hash = await (0, import_bcryptjs.hash)(password, 6);
    const userWithSameEmail = await this.userRepository.findByEmail(email);
    if (userWithSameEmail) {
      throw new UserAlreadyExists();
    }
    const userData = {
      name,
      email,
      password_hash
    };
    const user = await this.userRepository.create(userData);
    return {
      user
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegisterService
});
