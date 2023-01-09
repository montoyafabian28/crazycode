class BookmarksControl {
    #node = ""
    #value = ""
    #configP = {configP} 
    #configPData = this.#configP['data']
    #results = []
    #method = ''
    #check = 'n'

    constructor(method, node) {
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

    #selectMethod() {
        switch(this.#method){
            case 'values':
                this.#results = {values} ?? [[],[]]
                break
            case 'returned':
            default:
                this.#results = {returned_values}['bk']
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
        return this
    }

    setSimple(bookmark, value, isCheck = false, needConcat = false, callback = undefined) {
        let bkReady = false

        if (this.#configPData[this.#node].includes(bookmark) && !this.isSet(bookmark)) {
            bkReady = true
            if (isCheck) {
                value = this.#check
            }
            if (needConcat) {
                if (value === true) {
                    bookmark = bookmark.concat('YES')
                }else if (value === false) {
                    bookmark = bookmark.concat('NO')
                }
            }
            if (callback !== undefined) {
                if(callback(bkReady) === true){
                    this.setBookmark(bookmark,value)
                }
            } else{
                this.setBookmark(bookmark,value)
            }
            return true
        }
        return false
    }

    setComplex(bookmark, value, prefix = '', sufix = '', isCheck = false, callback = undefined) {
        let bkReady = false
        const bk = prefix + bookmark + sufix

        if (this.#configPData[this.#node].includes(bk) && !this.isSet(bk)) {
            bkReady = true

            if (isCheck) {
                value = this.#check
            }

            if (callback !== undefined) {
                if(callback(bkReady) === true){
                    this.setBookmark(bookmark,value)
                }
            } else{
                this.setBookmark(bookmark,value)
            }

            return true
        } 
        return false
    }
}
