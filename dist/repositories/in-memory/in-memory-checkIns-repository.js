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

// src/repositories/in-memory/in-memory-checkIns-repository.ts
var in_memory_checkIns_repository_exports = {};
__export(in_memory_checkIns_repository_exports, {
  InMemoryCheckInsRepository: () => InMemoryCheckInsRepository
});
module.exports = __toCommonJS(in_memory_checkIns_repository_exports);
var import_node_crypto = require("crypto");
var import_dayjs = __toESM(require("dayjs"));
var InMemoryCheckInsRepository = class {
  constructor() {
    this.checkIns = [];
  }
  async findByUserIdOnDate(userId, date) {
    const startOfTheDay = (0, import_dayjs.default)(date).startOf("date");
    const endOfTheDay = (0, import_dayjs.default)(date).endOf("date");
    const checkOnSameDate = this.checkIns.find((check) => {
      const checkInDate = (0, import_dayjs.default)(check.created_at);
      const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
      return check.user_id === userId && isOnSameDate;
    });
    if (!checkOnSameDate) {
      return null;
    }
    return checkOnSameDate;
  }
  async findManyByUserId(userId, page) {
    return this.checkIns.filter((item) => item.user_id === userId).slice((page - 1) * 20, page * 20);
  }
  async findById(checkIn_id) {
    const checkIn = this.checkIns.find((item) => item.id === checkIn_id);
    if (!checkIn) {
      return null;
    }
    return checkIn;
  }
  async findByUserId(userId) {
    return this.checkIns.filter((item) => item.user_id === userId).length;
  }
  async save(checkIn) {
    const checkInIndex = this.checkIns.findIndex(
      (item) => item.id === checkIn.id
    );
    if (checkInIndex >= 0) {
      this.checkIns.splice(checkInIndex, 1, checkIn);
    }
    return checkIn;
  }
  async create(data) {
    const checkIn = {
      id: (0, import_node_crypto.randomUUID)(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      is_validated: data.is_validated ? new Date(data.is_validated) : null,
      created_at: /* @__PURE__ */ new Date()
    };
    this.checkIns.push(checkIn);
    return checkIn;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  InMemoryCheckInsRepository
});
