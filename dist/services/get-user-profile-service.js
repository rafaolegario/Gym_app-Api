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

// src/services/get-user-profile-service.ts
var get_user_profile_service_exports = {};
__export(get_user_profile_service_exports, {
  GetUserProfileService: () => GetUserProfileService
});
module.exports = __toCommonJS(get_user_profile_service_exports);

// src/services/errors/resource-not-found.ts
var ResourceNotFound = class extends Error {
  constructor() {
    super("Resource not found!");
  }
};

// src/services/get-user-profile-service.ts
var GetUserProfileService = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute({
    userID
  }) {
    const user = await this.userRepository.findById(userID);
    if (!user) {
      throw new ResourceNotFound();
    }
    return { user };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GetUserProfileService
});
