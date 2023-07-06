function Ship(length = 1){
    return {
        length,
        hits: 0,
        sunk: false,
        isSunk(){
            if (this.hits === this.length){
                this.sunk = true
            }
        },
        hit(){
            this.hits ++
            this.isSunk()
        }
    }
}

module.exports = { Ship };
