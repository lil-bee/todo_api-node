import { Router } from "express";

const router = Router();

/* ===== TODO ====  */

router.get("/todos", (req, res) => {
  res.json({ message: "todos" });
});

router.get("/todos/:id", (req, res) => {});

router.post("/todos", (req, res) => {});

router.put("/todos/:id", (req, res) => {});

router.delete("/todos/:id", (req, res) => {});

/* ===== USER ====  */

router.get("/user", (req, res) => {
  res.json({ message: "user" });
});

router.get("/user/:id", (req, res) => {});

router.post("/register", (req, res) => {});

router.post("/login", (req, res) => {});

router.put("/user/:id", (req, res) => {});

router.delete("/user/:id", (req, res) => {});
