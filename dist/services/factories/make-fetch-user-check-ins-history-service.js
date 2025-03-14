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

// src/services/factories/make-fetch-user-check-ins-history-service.ts
var make_fetch_user_check_ins_history_service_exports = {};
__export(make_fetch_user_check_ins_history_service_exports, {
  MakeFetchUserCheckInsHistoryService: () => MakeFetchUserCheckInsHistoryService
});
module.exports = __toCommonJS(make_fetch_user_check_ins_history_service_exports);

// src/services/fetch-user-check-ins-history-service.ts
var FetchUserCheckInsHistoryService = class {
  constructor(checkInsRepository) {
    this.checkInsRepository = checkInsRepository;
  }
  async execute({
    userID,
    page
  }) {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userID,
      page
    );
    return { checkIns };
  }
};

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

// src/services/factories/make-fetch-user-check-ins-history-service.ts
function MakeFetchUserCheckInsHistoryService() {
  const checkInsRepository = new PrismaCheckInsRepository();
  const checkInsHistoryService = new FetchUserCheckInsHistoryService(
    checkInsRepository
  );
  return checkInsHistoryService;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MakeFetchUserCheckInsHistoryService
});
