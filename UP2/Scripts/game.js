var currentZombie = null;
var energy = 25;
var currentLocation = null;
var gameOver = false;

$(function () {
    $("#hunt").click(function () { Hunt(); });

    $("#huntall").click(function () { HuntAll(); });

    UpdateEnergy();
});

function SetZombie(location, health) {
    if (!health) {
        health = 10;
    }

    $("#" + location).addClass("zombie")
            .attr("data-health", health)
            .html(health)
            .hover(function () { CalcEnergy(this) })
            .click(function () { Move(this) });
}

function Move(element) {
    if (gameOver) {
        return;
    }
    
    currentZombie = element;

    energy = energy - lineDistance(currentLocation, element);

    SetMe($(element).attr("id"));

    UpdateEnergy();

    DetermineEndOfGame();
}

function HuntAll() {
    if (gameOver) {
        return;
    }

    if (!currentZombie) {
        alert('go to a zombie to hunt!');
        return;
    }

    var health = $(currentZombie).attr("data-health");

    for (var i = 0; i < health; i++) {
        Hunt();
        if (gameOver) return;
    }
}

function Hunt() {
    if (!currentZombie) {
        alert('go to a zombie to hunt!');
        return;
    }

    if (gameOver) {
        return;
    }

    energy -= 1;

    $(currentZombie).attr("data-health", $(currentZombie).attr("data-health") - 1);

    $(currentZombie).html($(currentZombie).attr("data-health"));

    if ($(currentZombie).attr("data-health") == 0) {
        $(currentZombie).removeClass("zombie")
                .unbind('click')
                .html("");

        currentZombie = null;

        alert("destroyed! energy replenished!");

        energy = 25;
    }

    DetermineEndOfGame();

    UpdateEnergy();
}

function UpdateEnergy() {
    $("#energy").html(energy);
}

function DetermineEndOfGame() {
    if (energy <= 0) {
        alert("game over!!!");
        gameOver = true;
    }
    else if ($(".zombie").length == 0) {
        alert("you win!!!");
        gameOver = true;
    }
}

function SetMe(location) {
    $(".square").removeClass("me");
    $("#" + location).addClass("me");

    currentLocation = $("#" + location);
}

function CalcEnergy(element) {
    var calc = lineDistance(currentLocation, element);

    if (calc == 0) {
        $("#calcEnergy").html("");
        return;
    }

    $("#calcEnergy").html("It'll take " + calc + " energy to move here.");
}

function lineDistance(point1, point2) {
    point1 = toPoint(point1);

    point2 = toPoint(point2);

    var xs = 0;
    var ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.round(Math.sqrt(xs + ys));
}

function toPoint(element) {
    var translateY = {
        A: 1,
        B: 2,
        C: 3,
        D: 4,
        E: 5,
        F: 6,
        G: 7,
        H: 8,
        I: 9,
        J: 10
    };

    var point = {
        x: parseInt($(element).attr("id")[0]),
        y: parseInt(translateY[$(element).attr("id")[1]])
    };

    if ($(element).attr("id").length == 3) {
        point = {
            x: parseInt($(element).attr("id")[0] + $(element).attr("id")[1]),
            y: parseInt(translateY[$(element).attr("id")[2]])
        };
    }

    return point;
}

var items = {
    Tent: function () {
        var item =
            $('<a href="javascript:;">Use tent (replenishes energy up to 25 points)</a>')
                .click(function () {
                    energy = 25;
                    UpdateEnergy();
                    $(this).remove();
                });

        $("#items").append(item);
    }
};

function SetItem(name) {
    items[name]();
}
