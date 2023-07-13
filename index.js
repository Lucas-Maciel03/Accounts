const fs = require('fs')

const inquirer = require('inquirer')
const chalk = require('chalk')

operation()

function operation(){
    inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: "O que deseja fazer?",
            choices: ['Criar conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair']
        }
    ]).then((answer) =>{
        const action = answer['action']

        if(action === 'Criar conta'){
            createAccount()
        } else if(action === 'Consultar Saldo'){
            getAcountBalance()
        } else if(action === 'Depositar'){
            deposit()
        } else if(action === 'Sacar'){
            withDraw()
        } else if(action === 'Sair'){
            console.log(chalk.bgBlue.black('Obrigado por usar o Accounts!'))
            process.exit()
        }
    }).catch(err => err)
}

function createAccount(){
    console.log(chalk.bgGreen.black('Obrigado por escolher nosso banco!'))
    console.log(chalk.green('Defina as opções da sua conta a seguir'))

    buildAccount()
}

function buildAccount(){
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Digite um nome para sua conta:'
        }
    ]).then((answer) =>{
        const accountName = answer['accountName']

        if(!fs.existsSync('accounts')){
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)){
            console.log(chalk.bgRed('Essa conta ja existe, escolha outro nome!'))
            return buildAccount()
        }

        createAccountPassword(accountName)

    }).catch(err => err)
}

function createAccountPassword(accountName){
    inquirer.prompt([
        {
            name: "password",
            message: "Crie uma senha de 6 digitos para sua conta"
        }
    ]).then((answer) => {
        const password = answer['password']

        if(!checkPassword(password)){
            return createAccountPassword(accountName)
        }

        fs.writeFileSync(`accounts/${accountName}.json`,
        `{"balance":"0", "password":${password}`,
        function (err){
            console.log(err)
        })

        console.log(chalk.green('Parabéns, sua conta foi criada com sucesso'))

    }).catch(err => err)
}

function checkPassword(password){
    if(!password){
        console.log(chalk.bgRed('Senha não esta no padrão necessario!'))
        return false
    }

    if(password.length < 6 || password.length > 6){
        console.log(chalk.bgRed('A senha precisa ter 6 digitos!'))
        return false
    }
    return true
}