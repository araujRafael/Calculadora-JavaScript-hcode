class CalcController {

    constructor(){

        this._audio = new Audio('click.mp3')//Audio() É uma api do proprio navegador.
        this._audioOnOff = false
        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this.locale = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");

        // o anderline deixa privado
               
        this._currentDate; //Ele vai dentro do "_dateEl e do _timeEl " com a propriedade "toLocaleDate/TimeString", assim, ele recebe a essa funcionalidade

        this.initButtonsEvents();

        this.initialize();

        this.initKeyBoard();
    }

    //manipular o 'DOM=Document Object Model'. serve pra manipular o site, !== de 'BOM = Browser Object Model' q serve pra manipular o navegador.
    // cada <TAG> vira um objeto. No console do google, colocando dir(document) eu posso ver todos o objetos do DOM 

    // Eu posso usar tanto "document.getElementById("display")" quanto "document.querySelector("#display")"

    copyToClipboard(){

        let input = document.createElement('input')

        input.value = this.displayCalc 

        document.body.appendChild(input)

        input.select(input)

        document.execCommand('Copy')

        input.remove()

    }

    pasteFromCLipborad(){

        document.addEventListener('paste', e => {
            let text = e.clipboardData.getData('Text')

            this.displayCalc = parseFloat(text)

            console.log(text);
        })

    }

    initialize(){
        // O "innerHTML" pega o elemento requisitado e transforma em HTML.     
        // "setInterval" inicializa a função repetidamente com o tempo em milesegundos determinados. "setTimeOut" so executa uma vez.

        this.setDisplayDateTime();//transformei o metodo em objeto 

        setInterval(() => {

            this.setDisplayDateTime();

        },1000);

       /*"clearInterval" finaliza o "setTimeOut"
        setTimeOut(()=>{
            clearInterval(interval); ("interval" era um atributo feito no metodo acima)
        },10000);*/ 

        this.setLastNumberToDisplay()

        this.pasteFromCLipborad()

        document.querySelectorAll('.btn-ac').forEach(btn=>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio()
            })
        })

    }

    toggleAudio(){

        this._audioOnOff = !this._audioOnOff

    }

    playAudio(){

        if (this._audioOnOff) {

            this._audio.currentTime = 0
            this._audio.play()

        }

    }

    initKeyBoard(){

        

        document.addEventListener('keyup', e => {

            this.playAudio()

            switch(e.key){

                case "Escape":
                    this.clearAll(); 
                    break;
    
                case " ":
                case "Backspace":
                    this.clearEntry(); 
                    break;
    
                case "+":
                case "-":
                case "*":
                case "/":
                case "%":
                    this.addOperation(e.key)    
                    break;

                case "Enter":
                case "=":
                    this.calc()
                    break;   
    
                case ".":
                case ",":
                    this.addDot()
                    break;
    
                case "0":
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                    this.addOperation(parseInt(e.key)); //  "parseInt" converte "string" em 'numero' 
                    break;

                case 'c':
                if(e.ctrlKey) this.copyToClipboard()
                    break
                
            }

        })

    }


    clearAll(){
        this._operation = [];
        this._lastNumber = ''
        this._lastOperator = ''

        this.setLastNumberToDisplay()
    }

    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay()
    }

    getLastOperation(){
        return this._operation[this._operation.length - 1]
        // Por que tem "-1" ? isso retorna o ultimno digito da operação, ja que o array começa com '0'. ex: [0,1,2,3] como o array tem 4 digitos, menos 1 mostra o index 3 do array.
    }

    setLastOpertarion( value ) {
        this._operation[this._operation.length - 1] = value
    }

    isOperator(value){

        return (['+','-','*','%','/'].indexOf(value) > -1 )
        //Se ele encontrar o digito nesse array ele retorna a posição dele no array, se não ele retorna '-1'

    }

    pushOperation(value){

        this._operation.push(value)// '.push()' coloca um item na ultima fileira do array

        if(this._operation.length>3){

            

            this.calc( )

        }

    }

    getResult(){
        try{

            return eval(this._operation.join(""))

        }catch(e){
            setTimeout( ()=>{
                this.setError()
            },1)
        }

    }

    calc(){

        let last = '';
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            let firstItem = this._operation[0]

            this._operation = [firstItem,this._lastOperator,this._lastNumber];
            
        }

        if( this._operation.length > 3 ){

            last = this._operation.pop()

            this._lastNumber = this.getResult();

        }else if(this._operation.length == 3) {
   
            this._lastNumber = this.getLastItem(false);

        }

        
        let result = this.getResult()
        // o "join()": junta todos os itens do array com o parametro desejado, no caso, nada. O "eval()" : interpreta como uma operação
        

        if(last == '%'){

            result = result / 100
            // eu poderia fazer assim : result /= 100.

            this._operation = [result]

        }else{

            this._operation = [result]

            if(last) this._operation.push(last)

        }

        this.setLastNumberToDisplay()

    }

    getLastItem(isOperator = true){

        let lastItem;

        //for( index inicial ; condição ; incremento ou decremento ){ o que fazer }
        for(let i = this._operation.length-1 ; i >= 0 ; i-- ){

            if(this.isOperator(this._operation[i]) == isOperator ){
                lastItem = this._operation[i]
                break;// depois que encontrar o numero, não precisa mais realizar o "if", então para com o "break" 
            }

        }

        if(!lastItem){
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber
        }

        
        return lastItem;


    }

    setLastNumberToDisplay(){

        let lastNumber = this.getLastItem(false);
                
        if( !lastNumber ) lastNumber = 0

        this.displayCalc = lastNumber

    }

    addOperation(value){

        //esse "if" serve para trocar o operador antes de efetuar a operação
        if( isNaN( this.getLastOperation() ) ) {

            //string
            if(this.isOperator(value)){
                //trocar operador
                this.setLastOpertarion( value )

            }else{
                this.pushOperation(value)
                this.setLastNumberToDisplay()
            }
            
        }else{
            //number

            if(this.isOperator(value)){

                this.pushOperation(value)

            }else{

                let newValue = this.getLastOperation().toString() + value.toString()
                this.setLastOpertarion(newValue);
                // transformou oq era numero de string em numero e concatenou


                //atualizar display
                this.setLastNumberToDisplay()
            }

           
        }
        
    }

    setError(){
        this.displayCalc = "error";
    }

    addDot(){

        let lastOperation = this.getLastOperation()

        if( typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1 ) return;


        if(this.isOperator(lastOperation) || !lastOperation ){

            this.pushOperation('0.')

        }else{

            this.setLastOpertarion(lastOperation.toString() + '.')

        }

        this.setLastNumberToDisplay()

    }

    execBtn(value){

        this.playAudio()

        switch(value){

            case "ac":
                this.clearAll(); 
                break;

            case "ce":
                this.clearEntry(); 
                break;

            case "soma":
                this.addOperation('+')    
                break;

            case "subtracao":
                this.addOperation('-')    
                break;

            case "multiplicacao":
                this.addOperation('*')    
                break;

            case "divisao":
                this.addOperation('/')     
                break;

            case "porcento":
                this.addOperation('%')    
                break;

            case "igual":
                this.calc()
                break;   

            case "ponto":
                this.addDot('.')
                break;

            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                this.addOperation(parseInt(value)); //  "parseInt" converte "string" em 'numero' 
                break;

            
            default:
                this.setError();
                break;
        }

    }

    //separa o 'event' em array.
    addEventListenerAll(element,event,fnc){

        event.split(" ").forEach( event => {

            element.addEventListener(event, fnc, false)
            
        });

    }//separa o 'event' em array.

    //evento de click nos botões da calculadora
    initButtonsEvents(){

        let buttons = document.querySelectorAll("#buttons > g, #parts > g");// "querySelectorAll" copia todos em vez de so o primeiro "<g>"

        buttons.forEach((btn)=>{

            this.addEventListenerAll(btn,'click drag', e =>{

                let textBtn = btn.className.baseVal.replace("btn-","")

                this.execBtn(textBtn);// Os digitos inseridos em 'textBtn' iram para 'execBtn(value)'

            })

            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{

                btn.style.cursor = "pointer"

            })

        })

    }

    //apenas um metodo que guarda as infos da data e tempo
    setDisplayDateTime(){

        this.displayDate = this.currentDate.toLocaleDateString(this.locale,{day:"2-digit",month:"long",year:"numeric"});
        this.displayTime = this.currentDate.toLocaleTimeString(this.locale);

    }

    // "get e set" do "displaytime" e "displaydate".
    get displayTime(){
        return this._timeEl.innerHTML;
    }
    set displayTime(value){
        return this._timeEl.innerHTML = value;
    }


    get displayDate(){
        return this._dateEl.innerHTML;
    }

    set displayDate(value){
        return this._dateEl.innerHTML = value;
    }


// os "get e set" servem para recuperar e atribuir informações e também servem como encapsulamento, ou seja, não se torna acessivel fora dessa classe.
// agora ele se transformou em um metodo.

    get displayCalc(){
        
        return this._displayCalcEl.innerHTML;
        
    }

    set displayCalc(value){


        if(value.toString().length > 10){

            this.setError()
            return false

        }
        

        this._displayCalcEl.innerHTML = value
        
        
    }
       
    
//currentDate
    get currentDate(){
        return new Date()
    }
    set currentDate(value){
        this._currentDate = value
    }
}