function newElement(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barrier(reverse = false) {
    this.element = newElement('div', 'barrier')

    const border = newElement('div', 'border')
    const body = newElement('div', 'body')
    this.element.appendChild(reverse ? body : border)
    this.element.appendChild(reverse ? border : body)

    this.setHeight = height => body.style.height = `${height}px`
}


function Barriers(height, openSpace, x) {
    this.element = newElement('div', 'barriers')

    this.superior = new Barrier(true)
    this.inferior = new Barrier(false)

    this.element.appendChild(this.superior.element)
    this.element.appendChild(this.inferior.element)

    this.sortingOpening = () => {
        const superiorHeight = Math.random() * (height - openSpace)
        const inferiorHeight = height - openSpace - superiorHeight
        this.superior.setHeight(superiorHeight)
        this.inferior.setHeight(inferiorHeight)
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth


    this.sortingOpening()
    this.setX(x)

}

// const b = new Barriers(700, 200, 400)
// document.querySelector('[wm-flappy]').appendChild(b.element)

function BarriersOpening(height, width, openSpace, space, pointNotification) {
    this.pair = [
        new Barriers(height, openSpace, width),
        new Barriers(height, openSpace, width + space),
        new Barriers(height, openSpace, width + space * 2),
        new Barriers(height, openSpace, width + space * 3)
    ]

    const displacement = 3
    this.animation = () => {
        this.pair.forEach(pair => {
            pair.setX(pair.getX() - displacement)

            if(pair.getX() < -pair.getWidth()) {
                pair.setX(pair.getX() + space * this.pair.length)
                pair.drawOpening()
            }

            const middle = width / 2
            const middleCrossed = pair.getX() + displacement >= middle
                && pair.getX() < middle
            if(middleCrossed) pointNotification()
        })
    }

}

function Bird(gameHeight) {
    let flying = false

    this.element = newElement('img', 'bird')
    this.element.src = 'img/bird.png'

    this.getY  = () =>  parseInt(this.element.style.bottom.split('px')[0])
    this.setY = y => this.element.style.bottom = `${y}px`

    window.onkeydown = e => flying = true
    window.onkeyup = e => flying = false

    this.animation = () => {
        const newY = this.getY() + (flying ? 8 : -5)
        const maxHeight = gameHeight - this.element.clientHeight

        if(newY <= 0) {
            this.setY(0)
        } else if (newY >= maxHeight) {
            this.setY(maxHeight)
        } else {
            this.setY(newY)
        }
    }
    this.setY(gameHeight / 2)
}

function Progress() {
    this.element = newElement('span', 'progress')
    this.scoreUpdate = points => {
        this.element.innerHTML = points
    }
    this.scoreUpdate(0)
} 


function FlappyBird() {
    let points = 0

    const gameArea = document.querySelector('[wm-flappy]')
    const height = gameArea.clientHeight
    const width = gameArea.clientWidth

    const progress = new Progress()
    const barriersOpening = new BarriersOpening(height, width, 200, 400,
        () => progress.scoreUpdate(++points))
    const bird = new Bird(height)

    gameArea.appendChild(progress.element)
    gameArea.appendChild(bird.element)
    barriersOpening.pair.forEach(pair => gameArea.appendChild(pair.element))
    
    //Game loop
    this.start = () => {
        
        const temporizer = setInterval(() => {
            barriersOpening.animation()
            bird.animation()
        }, 20) 
    }
}

new FlappyBird().start()