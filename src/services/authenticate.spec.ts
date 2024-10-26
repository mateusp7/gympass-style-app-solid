import { InMemoryUsersRespository } from "@/repositories/in-memory/in-memory-users-respository";
import { describe, expect, it } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

describe("Authenticate Use Case", () => {
  it("should be able to authenticate", async () => {
    const usersRepository = new InMemoryUsersRespository();
    const sut = new AuthenticateUseCase(usersRepository);

    await usersRepository.create({
      name: "John Doe",
      email: "john@doe.com",
      password_hash: await hash('123456', 6)  
    })

    const { user } = await sut.execute({
      email: "john@doe.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it("should not be able to authenticate with wrong email", async () => {
    const usersRepository = new InMemoryUsersRespository();
    const sut = new AuthenticateUseCase(usersRepository);

    await expect(() => sut.execute({
      email: "john@doe2.com",
      password: "123456",
    })).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
    it("should not be able to authenticate with wrong password", async () => {
      const usersRepository = new InMemoryUsersRespository();
      const sut = new AuthenticateUseCase(usersRepository);

      await usersRepository.create({
        name: "John Doe",
        email: "john@doe.com",
        password_hash: await hash("123456", 6),
      });

      await expect(() =>
        sut.execute({
          email: "john@doe.com",
          password: "1234567",
        })
      ).rejects.toBeInstanceOf(InvalidCredentialsError);
    });
});
