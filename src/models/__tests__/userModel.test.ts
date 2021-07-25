import faker from "faker";

import User from "../userModel";
import db from "@jp/db/testDb";

beforeAll(async () => {
    await db.open();
});

afterAll(async () => {
    await db.close();
});

describe("save", () => {
    it("should create fake users", async () => {
        const password = faker.internet.password();
        const username = faker.name.firstName();
        const before = Date.now();

        const user = new User({ password, username });
        await user.save();

        const after = Date.now();
        const fetched = await User.findById(user._id);

        expect(fetched).not.toBeNull();
        expect(fetched!.username).toBe(username);
        expect(fetched!.password).not.toBe(password);
        expect(before).toBeLessThanOrEqual(fetched!.createdAt.getTime());
        expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after);
    });
});
