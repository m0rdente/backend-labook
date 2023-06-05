import { UserDatabase } from "../database/userDatabase"
import { GetUsersInputDTO, GetUsersOutputDTO, LoginInputDTO, LoginOutputDTO, SignupInputDTO, SignupOutputDTO } from "../dtos/UserDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { User } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { HashManager } from "../services/HashManager";
import { TokenPayload, UserDB, USER_ROLES } from "../types";

export class UserBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private hashManager: HashManager
  ) {}

  public getUsers = async (input: GetUsersInputDTO): Promise<GetUsersOutputDTO> => {
    const { q, token } = input;

    if (!token) {
      throw new BadRequestError("Token não enviado");
    }

    const payload = this.tokenManager.getPayload(token as string);

    if (payload === null) {
      throw new BadRequestError("Token Inválido");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      throw new BadRequestError("Usuario não autorizado");
    }

    if (typeof q !== "string" && q !== undefined) {
      throw new BadRequestError("'q' deve ser string ou undefined");
    }

    const usersDB = await this.userDatabase.findUsers(q);

    const users = usersDB.map((userDB) => {
      const user = new User(
        userDB.id,
        userDB.name,
        userDB.email,
        userDB.password,
        userDB.role,
        userDB.created_at
      );

      return user.toBusinessModel();
    });

    const output: GetUsersOutputDTO = users;

    return output;
  };

  public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
    const { name, email, password } = input;

    if (typeof name !== "string") {
      throw new BadRequestError("'name' deve ser string");
    }

    if (typeof email !== "string") {
      throw new BadRequestError("'email' deve ser string");
    }

    if (typeof password !== "string") {
      throw new BadRequestError("'password' deve ser string");
    }

    const hashedPassword = await this.hashManager.hash(password);

    const id = this.idGenerator.generate();

    const newUser = new User(
      id,
      name,
      email,
      hashedPassword,
      USER_ROLES.NORMAL,
      new Date().toISOString()
    );

    const newUserDB = newUser.toDBModel();
    await this.userDatabase.insertUser(newUserDB);

    const tokenPayload: TokenPayload = {
      id: newUser.getId(),
      name: newUser.getName(),
      role: newUser.getRole(),
    };

    const token = this.tokenManager.createToken(tokenPayload);

    const output: SignupOutputDTO = {
      message: "Cadastro realizado com sucesso",
      token,
    };

    return output;
  };

  public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
    const { email, password } = input;

    if (typeof email !== "string") {
      throw new BadRequestError("'email' deve ser string");
    }

    if (typeof password !== "string") {
      throw new BadRequestError("'password' deve ser string");
    }

    const userDB: UserDB | undefined = await this.userDatabase.findUserByEmail(
      email
    );

    if (!userDB) {
      throw new NotFoundError("'email' não cadastrado");
    }

    const user = new User(
      userDB.id,
      userDB.name,
      userDB.email,
      userDB.password,
      userDB.role,
      userDB.created_at
    );

    const hashedPassword = user.getPassword();

    const isPasswordCorrect = await this.hashManager.compare(
      password,
      hashedPassword
    );

    if (!isPasswordCorrect) {
        throw new BadRequestError("'password' incorreto")
    }

    const payload: TokenPayload = {
        id: user.getId(),
        name: user.getName(),
        role: user.getRole(),
    }

    const token = this.tokenManager.createToken(payload)

    const output: LoginOutputDTO = {
        message: "Login realizado com sucesso",
        token
    }

    return output
  };
}
