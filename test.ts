import {LoginController} from "./dental-clinic-api-js/src/login.controller";
import {User} from "./dental-clinic-api-js/src/user.entity";



class Human {
    // firstName: string
    //
    // constructor(firstName: string) {
    //     this.firstName = firstName
    // }
    //
    constructor(
        // @InjectRepository(User)
        private firstName: string) {
    }

    setFirstName(firstName) {
        this.firstName = firstName;
    }


    zwrocMojeImie() {
        return this.firstName;
    }

}



const monika = new Human("monika")
monika.zwrocMojeImie() // monika

monika.setFirstName("Adam")

monika.zwrocMojeImie() // Adam



const loginController = new LoginController()