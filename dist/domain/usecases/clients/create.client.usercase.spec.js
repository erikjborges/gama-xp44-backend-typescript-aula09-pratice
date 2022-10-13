"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const create_client_usecase_1 = require("./create.client.usecase");
const clients_repository_1 = require("../../../adapters/repositories/clients.repository");
const viacepfactory_api_1 = require("../../../infrastructure/apis/cep/viacepfactory.api");
const apicepfactory_api_1 = require("../../../infrastructure/apis/cep/apicepfactory.api");
jest.mock("../../../adapters/repositories/clients.repository");
const ClientRepositoryMock = clients_repository_1.ClientsRepository;
test("Teste unitário CreateClientUsecase", () => __awaiter(void 0, void 0, void 0, function* () {
    const clientRepository = new ClientRepositoryMock();
    clientRepository.create.mockResolvedValue({
        "cpf": '123456789027',
        "nome": "Erik Borges",
        "limiteCredito": 1000.00,
        "observacoes": "Bom pagador :)",
        "cep": "35535000",
        "endereco": {
            "bairro": "Bom Jardim das Pedras",
            "cep": "35535-000",
            "cidade": "Carmópolis de Minas",
            "complemento": "",
            "estado": "MG",
            "logradouro": "",
        }
    });
    const client = {
        "cpf": '123456789027',
        "nome": "Erik Borges",
        "limiteCredito": 1000.00,
        "observacoes": "Bom pagador :)",
        "cep": "35535000"
    };
    const createClientUsecase = new create_client_usecase_1.CreateClientUseCase(clientRepository, new viacepfactory_api_1.ViaCepFactory(), new apicepfactory_api_1.ApiCepFactory());
    expect(yield createClientUsecase.execute(client)).toMatchObject(client);
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLmNsaWVudC51c2VyY2FzZS5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2RvbWFpbi91c2VjYXNlcy9jbGllbnRzL2NyZWF0ZS5jbGllbnQudXNlcmNhc2Uuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLG1FQUE4RDtBQUU5RCwwRkFBc0Y7QUFDdEYsMEZBQW1GO0FBQ25GLDBGQUFtRjtBQUVuRixJQUFJLENBQUMsSUFBSSxDQUFDLG1EQUFtRCxDQUFDLENBQUM7QUFDL0QsTUFBTSxvQkFBb0IsR0FBRyxzQ0FBaUQsQ0FBQztBQUUvRSxJQUFJLENBQUMsb0NBQW9DLEVBQUUsR0FBUSxFQUFFO0lBRWpELE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxvQkFBb0IsRUFBb0MsQ0FBQztJQUN0RixnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUM7UUFDdEMsS0FBSyxFQUFFLGNBQWM7UUFDckIsTUFBTSxFQUFFLGFBQWE7UUFDckIsZUFBZSxFQUFFLE9BQU87UUFDeEIsYUFBYSxFQUFFLGdCQUFnQjtRQUMvQixLQUFLLEVBQUUsVUFBVTtRQUNqQixVQUFVLEVBQUU7WUFDUixRQUFRLEVBQUUsdUJBQXVCO1lBQ2pDLEtBQUssRUFBRSxXQUFXO1lBQ25CLFFBQVEsRUFBRSxxQkFBcUI7WUFDL0IsYUFBYSxFQUFFLEVBQUU7WUFDakIsUUFBUSxFQUFFLElBQUk7WUFDZCxZQUFZLEVBQUUsRUFBRTtTQUNsQjtLQUNKLENBQUMsQ0FBQztJQUVILE1BQU0sTUFBTSxHQUFpQjtRQUN6QixLQUFLLEVBQUUsY0FBYztRQUNyQixNQUFNLEVBQUUsYUFBYTtRQUNyQixlQUFlLEVBQUUsT0FBTztRQUN4QixhQUFhLEVBQUUsZ0JBQWdCO1FBQy9CLEtBQUssRUFBRSxVQUFVO0tBQ3BCLENBQUM7SUFFRixNQUFNLG1CQUFtQixHQUFHLElBQUksMkNBQW1CLENBQy9DLGdCQUFnQixFQUNoQixJQUFJLGlDQUFhLEVBQUUsRUFDbkIsSUFBSSxpQ0FBYSxFQUFFLENBQ3RCLENBQUM7SUFFRixNQUFNLENBQUMsTUFBTSxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUUsQ0FBQyxDQUFBLENBQUMsQ0FBQyJ9