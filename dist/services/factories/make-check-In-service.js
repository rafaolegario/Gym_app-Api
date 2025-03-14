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

// src/services/factories/make-check-In-service.ts
var make_check_In_service_exports = {};
__export(make_check_In_service_exports, {
  MakeCheckInService: () => MakeCheckInService
});
module.exports = __toCommonJS(make_check_In_service_exports);

// src/lib/prisma.ts
var import_client = require("@prisma/client");

// src/env/index.ts
var import_config = require("dotenv/config");
var import_zod = require("zod");
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["dev", "test", "production"]).default("dev"),
  JWT_SECRET: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("Invalid enviroment variavles", _env.error.format);
  throw new Error("Invalid enviroment variavles");
}
var env = _env.data;

// src/lib/prisma.ts
var prisma = new import_client.PrismaClient({
  log: env.NODE_ENV === "dev" ? ["query"] : []
});

// src/repositories/prisma/prisma-check-ins-repository.ts
var import_dayjs = __toESM(require("dayjs"));
var PrismaCheckInsRepository = class {
  async findByUserId(userId) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId
      }
    });
    return count;
  }
  async findManyByUserId(userId, page) {
    const checkins = await prisma.checkIn.findMany({
      where: {
        user_id: userId
      },
      take: 20,
      skip: (page - 1) * 20
    });
    return checkins;
  }
  async findById(id) {
    const checkin = await prisma.checkIn.findUnique({
      where: {
        id
      }
    });
    return checkin;
  }
  async findByUserIdOnDate(userId, date) {
    const startOfTheDay = (0, import_dayjs.default)(date).startOf("date");
    const endOfTheDay = (0, import_dayjs.default)(date).endOf("date");
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate()
        }
      }
    });
    return checkIn;
  }
  async save(checkIn) {
    const checkin = await prisma.checkIn.update({
      where: {
        id: checkIn.id
      },
      data: checkIn
    });
    return checkin;
  }
  async create(data) {
    const checkin = await prisma.checkIn.create({
      data
    });
    return checkin;
  }
};

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

// src/repositories/prisma/prisma-gym-repository.ts
var PrismaGymsRepository = class {
  async searchMany(query, page) {
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query
        }
      },
      take: 20,
      skip: (page - 1) * 20
    });
    return gyms;
  }
  async searchNearby({ latitude, longitude }) {
    const gyms = await prisma.$queryRaw`
    SELECT * from gyms WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `;
    return gyms;
  }
  async findById(id) {
    const gym = await prisma.gym.findUnique({
      where: {
        id
      }
    });
    return gym;
  }
  async create(data) {
    const gym = await prisma.gym.create({
      data
    });
    return gym;
  }
};

// src/services/factories/make-check-In-service.ts
function MakeCheckInService() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const gymRepository = new PrismaGymsRepository();
  const checkInService = new CheckInService(checkInsRepository, gymRepository);
  return checkInService;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MakeCheckInService
});
