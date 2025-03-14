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

// src/repositories/in-memory/in-memory-gyms-repository.ts
var in_memory_gyms_repository_exports = {};
__export(in_memory_gyms_repository_exports, {
  InMemoryGymRepository: () => InMemoryGymRepository
});
module.exports = __toCommonJS(in_memory_gyms_repository_exports);
var import_client = require("@prisma/client");
var import_node_crypto = require("crypto");

// src/utils/get-distance-between-coordinates.ts
function GetDistanceBetweenCoordinates(to, from) {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0;
  }
  const fromRadian = Math.PI * from.latitude / 180;
  const toRadian = Math.PI * to.latitude / 180;
  const theta = from.longitude - to.longitude;
  const radTheta = Math.PI * theta / 180;
  let dist = Math.sin(fromRadian) * Math.sin(toRadian) + Math.cos(fromRadian) * Math.cos(toRadian) * Math.cos(radTheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = dist * 180 / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;
  return dist;
}

// src/repositories/in-memory/in-memory-gyms-repository.ts
var InMemoryGymRepository = class {
  constructor() {
    this.gyms = [];
  }
  async create(data) {
    const gym = {
      id: (0, import_node_crypto.randomUUID)(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      longitude: new import_client.Prisma.Decimal(data.longitude.toString()),
      latitude: new import_client.Prisma.Decimal(data.latitude.toString()),
      created_at: /* @__PURE__ */ new Date()
    };
    this.gyms.push(gym);
    return gym;
  }
  async searchMany(query, page) {
    return this.gyms.filter((item) => item.title.includes(query)).slice((page - 1) * 20, page * 20);
  }
  async searchNearby({ latitude, longitude }) {
    const gyms = this.gyms.filter((item) => {
      const distance = GetDistanceBetweenCoordinates(
        {
          latitude,
          longitude
        },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber()
        }
      );
      const MAX_DISTANCE_IN_KILOMETERS = 10;
      return distance <= MAX_DISTANCE_IN_KILOMETERS;
    });
    return gyms;
  }
  async findById(id) {
    const gym = this.gyms.find((Gym2) => Gym2.id === id);
    if (!gym) {
      return null;
    }
    return gym;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryGymRepository
});
