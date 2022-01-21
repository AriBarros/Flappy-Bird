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

    this.drawOpening = () => {
        const superiorHeight = Math.random() * (height - openSpace)
        const inferiorHeight = height - openSpace - superiorHeight
        this.superior.setHeight(superiorHeight)
        this.inferior.setHeight(inferiorHeight)
    }

    this.getX = () => parseInt(this.element.style.left.split('px')[0])
    this.setX = x => this.element.style.left = `${x}px`
    this.getWidth = () => this.element.clientWidth


    this.drawOpening()
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

const barriersOpening = new BarriersOpening(700, 1200, 200, 400)
const gameArea = document.querySelector('[wm-flappy]')
barriersOpening.pair.forEach(pair => gameArea.appendChild(pair.element))
setInterval(() => {
    barriersOpening.animation()
}, 20)