import { Request, Response } from "express";
import { AccountMap } from "../models/accountMap";
import {
    sendSuccess,
    sendCreated,
    sendBadRequest,
} from "../utils/responseHelper";

interface AddAccountRequest extends Request {
    body: {
        internalUserId: string;
        accountId: string;
    };
}

interface RemoveAccountRequest extends Request {
    body: {
        accountId: string;
    };
}

export class IdController {
    private accountMap: AccountMap;

    constructor(accountMap: AccountMap) {
        this.accountMap = accountMap;
    }

    /**
     * Handles adding an internal user ID and account ID pair to the account map.
     */
    addAccount = (req: AddAccountRequest, res: Response): void => {
        const { internalUserId, accountId } = req.body;

        if (!internalUserId || !accountId) {
            sendBadRequest(
                res,
                "Both internalUserId and accountId are required."
            );
            return;
        }

        try {
            this.accountMap.addAccount(internalUserId, accountId);
            sendCreated(res, "Account added successfully.");
        } catch (error: any) {
            sendBadRequest(res, error.message);
        }
    };

    /**
     * Handles removing an account ID from the account map.
     */
    removeAccount = (req: RemoveAccountRequest, res: Response): void => {
        const { accountId } = req.body;

        if (!accountId) {
            sendBadRequest(res, "AccountId is required.");
            return;
        }

        try {
            this.accountMap.removeAccount(accountId);
            sendSuccess(res, "Account removed successfully.");
        } catch (error: any) {
            sendBadRequest(res, error.message);
        }
    };
}
