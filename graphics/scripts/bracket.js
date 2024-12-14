class LISwissAnimator {
    beforeHide() {

    }

    async hide(element) {
        const overflowWrappers = element.querySelectorAll('.match-row-overflow-wrapper');
        const accents = element.querySelectorAll('.match-row-accent');

        return Promise.all([
            gsap.to(overflowWrappers, {
                width: '0%',
                duration: 0.75,
                ease: Power3.easeIn,
                stagger: 0.05
            }),
            gsap.to(accents, {
                width: '0%',
                duration: 0.75,
                ease: Power3.easeIn,
                stagger: 0.05,
                delay: 0.1
            })
        ]);
    }

    beforeReveal(element) {
        gsap.set(element.querySelectorAll('.match-row-overflow-wrapper, .match-row-accent'), { width: '0%' });
    }

    async reveal(element) {
        const overflowWrappers = element.querySelectorAll('.match-row-overflow-wrapper');
        const accents = element.querySelectorAll('.match-row-accent');

        return Promise.all([
            gsap.to(overflowWrappers, {
                width: '100%',
                duration: 0.75,
                ease: Power3.easeOut,
                stagger: 0.05,
                delay: 0.1
            }),
            gsap.to(accents, {
                width: '100%',
                duration: 0.75,
                ease: Power3.easeOut,
                stagger: 0.05
            })
        ]);
    }
}

class LIBracketAnimator extends TourneyviewRenderer.D3BracketAnimator {
    swissAnimator = new LISwissAnimator();
}

const renderer = new TourneyviewRenderer.BracketRenderer({
    animator: new LIBracketAnimator(),
    swissOpts: {
        rowHeight: 50,
        rowGap: 1,
        useScrollMask: true,
        onCellCreation(selection) {
            selection.each(function() {
                const contentWrapper = document.createElement('div');
                contentWrapper.classList.add('match-row-overflow-wrapper');
                this.appendChild(contentWrapper);
                const content = this.querySelector('.match-row');
                contentWrapper.appendChild(content);
                const backgroundElem = document.createElement('div');
                backgroundElem.classList.add('match-row-accent');
                this.appendChild(backgroundElem);
            });
        }
    },
    roundRobinOpts: {
        maxScale: 1.75,
        columnGap: 6
    }
});

const bracketContainer = document.getElementById('bracket-container');
bracketContainer.appendChild(renderer.element);

document.addEventListener('DOMContentLoaded', async () => {
    await document.fonts.load('400 32px Montserrat');

    bracketData.on('change', newValue => {
        if (newValue != null) {
            void renderer.setData(newValue);
        }
    });
});
