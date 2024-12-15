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

class LIEliminationAnimator {
    beforeHide() {

    }

    async hide(element, opts) {
        return gsap.to(element, { opacity: 0, duration: 0.35, delay: opts.delay });
    }

    beforeReveal(element) {
        gsap.set(element, { opacity: 1 });
        gsap.set(element.querySelectorAll('.match-cell-overflow-wrapper, .match-cell-accent'), { width: '0%' });
        gsap.set(element.querySelectorAll('.bracket-link'), { strokeDashoffset: '-1' });
        gsap.set(element.querySelectorAll('.round-label, .elimination-renderer__bracket-title'), { opacity: 0 });
    }

    async reveal(element, opts) {
        const depth = opts.renderer.getBracketDepth();

        return Promise.all([
            gsap.to(
                element.querySelectorAll('.round-label, .elimination-renderer__bracket-title'),
                {
                    duration: 0.35,
                    opacity: 1,
                    stagger: function(index, target) {
                        if (target.dataset.roundIndex != null) {
                            return Number(target.dataset.roundIndex) * 0.1;
                        } else {
                            return 0;
                        }
                    }
                }
            ),
            gsap.to(element.querySelectorAll('.bracket-link'), {
                strokeDashoffset: '0',
                autoRound: false,
                duration: 0.75,
                ease: Power3.easeInOut,
                stagger: function(index, target) {
                    return (depth - target.__data__.source.depth) * 0.2;
                },
                delay: 0.1 + (opts.delay ?? 0)
            }),
            gsap.to(element.querySelectorAll('.match-cell-overflow-wrapper'), {
                width: '100%',
                duration: 0.65,
                ease: Power3.easeOut,
                delay: 0.1 + (opts.delay ?? 0),
                stagger: function(index, target) {
                    return (depth - target.parentNode.__data__.depth) * 0.1;
                }
            }),
            gsap.to(element.querySelectorAll('.match-cell-accent'), {
                width: '100%',
                duration: 0.65,
                ease: Power3.easeOut,
                stagger: function(index, target) {
                    return (depth - target.parentNode.__data__.depth) * 0.1;
                },
                delay: opts.delay
            })
        ]);
    }
}

class LIBracketAnimator extends TourneyviewRenderer.D3BracketAnimator {
    swissAnimator = new LISwissAnimator();
    eliminationAnimator = new LIEliminationAnimator();
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
    },
    eliminationOpts: {
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
                this.style.setProperty('--original-cell-width', this.style.width);
            });
        }
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
    const title = bracketData.matchGroups.length === 1 && bracketData.matchGroups[0].name !== bracketData.name
        ? bracketData.matchGroups[0].name
        : bracketData.name;

    if (bracketData.roundNumber != null) {
        return `${title} - Round ${bracketData.roundNumber}`;
    } else {
        return title;
    }
}
