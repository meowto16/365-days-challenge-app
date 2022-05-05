const main = function () {
  const tooltipNodes = [...document.querySelectorAll('[data-popper]')]

  const tooltipNode = document.querySelector('.tooltip')
  const tooltipTitle = tooltipNode.querySelector('.js-tooltip-title')
  const tooltipDescription = tooltipNode.querySelector('.js-tooltip-description')

  if (tooltipNodes.length) {
    tooltipNodes.forEach(node => {

      const show = (e) => {
        e.stopPropagation()

        const title = node.getAttribute('data-popper-title')
        const description = node.getAttribute('data-popper-description')

        tooltipTitle.innerText = title || ''
        tooltipDescription.innerHTML = description || ''

        tooltipNode.classList.remove('tooltip--hidden')
        tooltipNode.classList.add('tooltip--visible')

        Popper.createPopper(node, tooltipNode, {
            placement: 'top',
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 8],
                },
              },
            ]
          }
        )
      }

      const hide = (e) => {
        e.stopPropagation()

        tooltipNode.classList.remove('tooltip--visible')
        tooltipNode.classList.add('tooltip--hidden')
      }

      node.addEventListener('mouseenter', show)
      node.addEventListener('focus', show)
      node.addEventListener('click', show)
      node.addEventListener('mouseleave', hide)
      node.addEventListener('blur', hide)
      document.body.addEventListener('click', hide)
    })
  }
}

window.addEventListener('load', main)
