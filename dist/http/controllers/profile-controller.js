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

// src/http/controllers/profile-controller.ts
var profile_controller_exports = {};
__export(profile_controller_exports, {
  ProfileController: () => ProfileController
});
module.exports = __toCommonJS(profile_controller_exports);

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

// src/repositories/prisma/prisma-users-repository.ts
var PrismaUsersRepository = class {
  async findByEmail(email) {
    const user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    return user;
  }
  async findById(id) {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    });
    return user;
  }
  async create(data) {
    const users = await prisma.user.create({
      data
    });
    return users;
  }
};

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

// src/services/factories/make-get-user-profile-service.ts
function MakeGetUserProfileService() {
  const UsersRepository = new PrismaUsersRepository();
  const getUserProfileService = new GetUserProfileService(UsersRepository);
  return getUserProfileService;
}

// src/http/controllers/profile-controller.ts
async function ProfileController(request, reply) {
  const getUserProfile = MakeGetUserProfileService();
  const { user } = await getUserProfile.execute({
    userID: request.user.sub
  });
  reply.status(200).send({
    user: {
      ...user,
      password_hash: void 0
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ProfileController
});
