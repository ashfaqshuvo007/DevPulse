import { Router } from "express";
import { issueController } from "./issue.controller";
import { auth } from "../../middleware/auth";
import { USER_ROLES } from "../../types";

const router = Router();

router.get(
  "/",
  auth(USER_ROLES.contributor, USER_ROLES.maintainer),
  issueController.getAllIssues,
);
router.get("/:id", issueController.getSingleIssue);

router.post(
  "/",
  auth(USER_ROLES.contributor, USER_ROLES.maintainer),
  issueController.createIssue,
);
router.patch("/:id", issueController.updateIssue);

router.delete("/:id", issueController.deleteIssue);

export const issueRouter = router;
