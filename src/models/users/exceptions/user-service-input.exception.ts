/**
 * Used to extend another exception to make it
 * instanceof UserServiceInputException
 */

export class UserServiceInputException extends Error{

    constructor(message:string){
        super(message)
    }
}