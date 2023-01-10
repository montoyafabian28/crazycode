class BookmarksControl {
    #node = ''
    #configP = {configP} 
    #configPData = this.#configP['data']
    #results = []
    #method = ''
    #check = 'n'
    #rv = {returned_values}

    constructor(method, node = 'bookmarks') {
        this.#method = method
        this.#node = node
        this.#selectMethod()
    }

    set node(value) {
        this.#node = value
    }

    get node() {
        return this.#node
    }

    get method() {
        return this.#method
    }

    get results() {
        return this.#results
    }

    get configPData() {
        return this.#configPData
    }

    #selectMethod() {
        switch(this.#method){
            case 'values':
                this.#results = [[],[]]
                break
            case 'returned':
            default:
                this.#results = this.#rv['bk']
                break
        }
    }

    isSet(bookmark) {
        if(this.#method === 'values'){
            return this.#results[0].includes(bookmark)
        }else{
            return Object.keys(this.#results).includes(bookmark)
        }
    }

    setBookmark(bookmark, value) {
        if(this.#method === 'values'){
            this.#results[0].push(bookmark)
            this.#results[1].push(value)
        }else{
            this.#results[bookmark] = value
        }
        return true
    }

    setSimple(bookmark, value, needConcat = false, conditions = undefined)  {
        let bk = bookmark
        const includesTheBK = this.#configPData[this.#node].some(element => element.includes(bk))

        if (includesTheBK && !this.isSet(bookmark)) {
            if (needConcat === true) {
                if (value === true) {
                    bk = bookmark + 'YES'
                }else if (value === false) {
                    bk = bookmark + 'NO'
                }
            }
            if (typeof value === 'boolean') {
                value = this.#check
            }

            if (conditions !== undefined) {
                if(conditions(bk,value) === true){
                    return this.setBookmark(bk,value)
                }
            } else{
                return this.setBookmark(bk,value)
            }
        }
        return false
    }

    setComplex(bookmark, value, {prefix = '', sufix = '', conditions = undefined}) {
        const bk = prefix + bookmark + sufix
        const includesTheBK = this.#configPData[this.#node].some(element => element.includes(bk))

        if (includesTheBK && !this.isSet(bk)) {
            if (typeof value === 'boolean') {
                value = this.#check
            }
            if (conditions !== undefined) {
                if(conditions(bk,value) === true){
                    return this.setBookmark(bk,value)
                }
            } else{
                return this.setBookmark(bk,value)
            }
        } 
        return false
    }
}

const bkControl = new BookmarksControl('values','bookmarks')

const res = bkControl.setSimple('Preventive_Deductibleapplies',true, true, () => true)  // Resultado: Preventive_DeductibleappliesYES: n
const res2 = bkControl.setComplex('_4quads', true, 
    {prefix: 'D4341', sufix:'YES', conditions: () => res === true}) // Resultado: D4341_4quadsYES: n

console.log(bkControl.results)

return bkControl.results