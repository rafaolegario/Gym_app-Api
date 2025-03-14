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

// src/services/factories/make-authenticate-service.ts
var make_authenticate_service_exports = {};
__export(make_authenticate_service_exports, {
  MakeAuthenticateService: () => MakeAuthenticateService
});
module.exports = __toCommonJS(make_authenticate_service_exports);

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

// src/services/authenticate-service.ts
var import_bcryptjs = require("bcryptjs");

// src/services/errors/invalid-credentials.ts
var InvalidCredentials = class extends Error {
  constructor() {
    super("Invalid credentials!");
  }
};

// src/services/authenticate-service.ts
var AuthenticateService = class {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async execute({
    email,
    password
  }) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentials();
    }
    const doesPasswordMatches = await (0, import_bcryptjs.compare)(password, user.password_hash);
    if (!doesPasswordMatches) {
      throw new InvalidCredentials();
    }
    return { user };
  }
};

// src/services/factories/make-authenticate-service.ts
function MakeAuthenticateService() {
  const UsersRepository = new PrismaUsersRepository();
  const authenticateService = new AuthenticateService(UsersRepository);
  return authenticateService;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MakeAuthenticateService
});
