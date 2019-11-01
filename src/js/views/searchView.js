import {
    elements
} from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};


export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const higlightSelected = id => {
    const ressultsArr = Array.from(document.querySelectorAll('.results__link'));
    ressultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href="#${id}"]`).classList.add('results__link--active')
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                // push to new arr
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);
        //return new value of title
        return `${newTitle.join(' ')} ...`
    }
    return title;
};

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
}

const createBtn = (page, type) => `

        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1 }>
            <span>Page ${type === 'prev' ? page - 1 : page + 1 }</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right' }"></use>
            </svg>
        </button>
`;

const noBtn = () => {
    elements.noBtn.innerHTML = '';
};


const renderButtons = (page, numResult, resPerPage) => {
    const pages = Math.ceil(numResult / resPerPage);

    let button;

    if (page === 1 && pages > 1) {
        // show only btn for next pages
        button = createBtn(page, 'next');
    } else if (page < pages) {
        // show btn for both side
        button = `
        ${button = createBtn(page,'prev')}
        ${button = createBtn(page,'next')}
        `;
    } else if (page === pages && pages > 1) {
        // show only btn for prev pages
        button = createBtn(page, 'prev')
    }
    // else {
    //     noBtn();
    // }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button)
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render rsult of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);

    //render paginntion button
    renderButtons(page, recipes.length, resPerPage)
}