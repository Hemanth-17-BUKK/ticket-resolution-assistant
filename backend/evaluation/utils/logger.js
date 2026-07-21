function line() {

    console.log(
        "=================================================="
    );

}

function title(text) {

    line();

    console.log(text);

    line();

}

function success(text) {

    console.log(`✓ ${text}`);

}

function failure(text) {

    console.log(`✗ ${text}`);

}

module.exports = {

    line,

    title,

    success,

    failure

};