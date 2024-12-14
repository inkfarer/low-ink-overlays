class LISwissAnimator {
    beforeHide() {

    }

    async hide(element) {
        const overflowWrappers = element.querySelectorAll('.match-cell-overflow-wrapper');
        const accents = element.querySelectorAll('.match-cell-accent');

        return Promise.all([
            gsap.to(overflowWrappers, {
                width: '0%',
                duration: 0.65,
                ease: Power3.easeIn,
                stagger: {
                    each: 0.08,
                    from: 'center',
                    grid: 'auto',
                    axis: 'x'
                }
            }),
            gsap.to(accents, {
                width: '0%',
                duration: 0.65,
                ease: Power3.easeIn,
                stagger: {
                    each: 0.08,
                    from: 'center',
                    grid: 'auto',
                    axis: 'x'
                },
                delay: 0.1
            })
        ]);
    }

    beforeReveal(element) {
        gsap.set(element.querySelectorAll('.match-cell-overflow-wrapper, .match-cell-accent'), { width: '0%' });
    }

    async reveal(element, opts) {
        const overflowWrappers = element.querySelectorAll('.match-cell-overflow-wrapper');
        const accents = element.querySelectorAll('.match-cell-accent');

        return Promise.all([
            gsap.to(overflowWrappers, {
                width: '100%',
                duration: 0.65,
                ease: Power3.easeOut,
                stagger: {
                    each: 0.08,
                    from: 'center',
                    grid: 'auto',
                    axis: 'x'
                },
                delay: 0.1 + (opts.delay ?? 0)
            }),
            gsap.to(accents, {
                width: '100%',
                duration: 0.65,
                ease: Power3.easeOut,
                stagger: {
                    each: 0.08,
                    from: 'center',
                    grid: 'auto',
                    axis: 'x'
                },
                delay: opts.delay
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
        cellHeight: 75,
        columnGap: 16,
        rowGap: 2,
        useScrollMask: true,
        onCellCreation(selection) {
            selection.each(function() {
                const contentWrapper = document.createElement('div');
                contentWrapper.classList.add('match-cell-overflow-wrapper');
                this.appendChild(contentWrapper);
                const content = this.querySelector('.match-cell');
                contentWrapper.appendChild(content);
                const backgroundElem = document.createElement('div');
                backgroundElem.classList.add('match-cell-accent');
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
const bracketTitleText = document.getElementById('bracket-title-text');

document.addEventListener('DOMContentLoaded', async () => {
    await document.fonts.load('400 32px Montserrat');

    bracketData.on('change', newValue => {
        if (newValue != null) {
            void renderer.setData(newValue);

            const bracketTitle = buildBracketTitle(newValue);
            if (bracketTitleText.text !== bracketTitle) {
                textOpacitySwap(bracketTitle, bracketTitleText);
            }
        }
    });

    TourneyviewRenderer.revealOnObsSourceVisible(renderer, 0.7);
});

function buildBracketTitle(bracketData) {
    if (bracketData.matchGroups.length === 1 && bracketData.matchGroups[0].name !== bracketData.name) {
        return bracketData.matchGroups[0].name;
    }

    return bracketData.name;
}
