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

// src/services/fetch-nearby-gyms-service.ts
var fetch_nearby_gyms_service_exports = {};
__export(fetch_nearby_gyms_service_exports, {
  FetchNearbyGymsService: () => FetchNearbyGymsService
});
module.exports = __toCommonJS(fetch_nearby_gyms_service_exports);
var FetchNearbyGymsService = class {
  constructor(gymsRepository) {
    this.gymsRepository = gymsRepository;
  }
  async execute({
    userLatitude,
    userLongitude
  }) {
    const gyms = await this.gymsRepository.searchNearby({
      latitude: userLatitude,
      longitude: userLongitude
    });
    return { gyms };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FetchNearbyGymsService
});
