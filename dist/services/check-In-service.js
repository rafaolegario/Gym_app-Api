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

// src/services/check-In-service.ts
var check_In_service_exports = {};
__export(check_In_service_exports, {
  CheckInService: () => CheckInService
});
module.exports = __toCommonJS(check_In_service_exports);

// src/services/errors/resource-not-found.ts
var ResourceNotFound = class extends Error {
  constructor() {
    super("Resource not found!");
  }
};

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

// src/services/errors/max-number-of-check-ins.ts
var MaxNumberOfCheckIns = class extends Error {
  constructor() {
    super("Max number of check-ins reached!");
  }
};

// src/services/errors/max-distance.ts
var MaxDistance = class extends Error {
  constructor() {
    super("Max distance reached!");
  }
};

// src/services/check-In-service.ts
var CheckInService = class {
  constructor(checkInsRepository, gymsRepository) {
    this.checkInsRepository = checkInsRepository;
    this.gymsRepository = gymsRepository;
  }
  async execute({
    userID,
    gymID,
    userLatitude,
    userLongitude
  }) {
    const gym = await this.gymsRepository.findById(gymID);
    if (!gym) {
      throw new ResourceNotFound();
    }
    const distance = GetDistanceBetweenCoordinates(
      { longitude: userLongitude, latitude: userLatitude },
      {
        longitude: gym.longitude.toNumber(),
        latitude: gym.latitude.toNumber()
      }
    );
    const MAX_DISTANCE_IN_KILOMETERS = 0.1;
    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistance();
    }
    const checkOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userID,
      /* @__PURE__ */ new Date()
    );
    if (checkOnSameDay) {
      throw new MaxNumberOfCheckIns();
    }
    const checkIn = await this.checkInsRepository.create({
      gym_id: gymID,
      user_id: userID
    });
    return { checkIn };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CheckInService
});
