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

// src/http/routes.ts
var routes_exports = {};
__export(routes_exports, {
  appRoutes: () => appRoutes
});
module.exports = __toCommonJS(routes_exports);

// src/http/controllers/register-cotroller.ts
var import_zod2 = require("zod");

// src/services/errors/user-already-exists.ts
var UserAlreadyExists = class extends Error {
  constructor() {
    super("E-mail already exists");
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

// src/services/register-service.ts
var import_bcryptjs = require("bcryptjs");
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

// src/services/factories/make-register-service.ts
function MakeRegisterService() {
  const UsersRepository = new PrismaUsersRepository();
  const registerService = new RegisterService(UsersRepository);
  return registerService;
}

// src/http/controllers/register-cotroller.ts
async function RegisterController(request, reply) {
  const resgisterBodySchema = import_zod2.z.object({
    name: import_zod2.z.string(),
    email: import_zod2.z.string().email(),
    password: import_zod2.z.string().min(6)
  });
  const { name, email, password } = resgisterBodySchema.parse(request.body);
  try {
    const registerService = MakeRegisterService();
    await registerService.execute({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlreadyExists) {
      reply.status(409).send({ message: error.message });
    }
    throw error;
  }
  reply.status(201).send();
}

// src/http/controllers/authenticate-controller.ts
var import_zod3 = require("zod");

// src/services/errors/invalid-credentials.ts
var InvalidCredentials = class extends Error {
  constructor() {
    super("Invalid credentials!");
  }
};

// src/services/authenticate-service.ts
var import_bcryptjs2 = require("bcryptjs");
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
    const doesPasswordMatches = await (0, import_bcryptjs2.compare)(password, user.password_hash);
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

// src/http/controllers/authenticate-controller.ts
async function AuthenticateController(request, reply) {
  const authBodySchema = import_zod3.z.object({
    email: import_zod3.z.string().email(),
    password: import_zod3.z.string().min(6)
  });
  const { email, password } = authBodySchema.parse(request.body);
  try {
    const authenticateService = MakeAuthenticateService();
    const { user } = await authenticateService.execute({ email, password });
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id
        }
      }
    );
    reply.status(200).send({ token });
  } catch (error) {
    if (error instanceof InvalidCredentials) {
      reply.status(409).send({ message: error.message });
    }
    throw error;
  }
}

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

// src/http/middlewares/verify-jwt.ts
async function VerifyJwt(request, reply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    reply.status(401).send({ message: "Unauthorized" });
  }
}

// src/http/routes.ts
async function appRoutes(app) {
  app.post("/users", RegisterController);
  app.post("/sessions", AuthenticateController);
  app.get("/me", { onRequest: [VerifyJwt] }, ProfileController);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  appRoutes
});
