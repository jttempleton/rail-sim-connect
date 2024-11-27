export interface Account {
    internalUserId: string;
    lastSeen: number;
}

export class AccountMap {
    private map: Map<string, Account>;

    constructor() {
        this.map = new Map();
    }

    addAccount(internalUserId: string, accountId: string): void {
        if (this.map.has(accountId)) {
            throw new Error(`Account ID ${accountId} already exists.`);
        }
        this.map.set(accountId, { internalUserId, lastSeen: Date.now() });
    }

    removeAccount(accountId: string): void {
        if (!this.map.has(accountId)) {
            throw new Error(`Account ID ${accountId} does not exist.`);
        }
        this.map.delete(accountId);
    }

    updateLastSeen(accountId: string): void {
        const account = this.map.get(accountId);
        if (!account) {
            throw new Error(`Account ID ${accountId} does not exist.`);
        }
        account.lastSeen = Date.now();
    }

    getInternalUserId(accountId: string): string | null {
        return this.map.get(accountId)?.internalUserId || null;
    }

    getLastSeen(accountId: string): number | null {
        return this.map.get(accountId)?.lastSeen || null;
    }

    hasAccount(accountId: string): boolean {
        return this.map.has(accountId);
    }

    getAllAccountIds(): string[] {
        return Array.from(this.map.keys());
    }
}

const accountMap = new AccountMap();
export default accountMap;
