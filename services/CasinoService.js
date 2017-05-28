app.service('BlackjackService', function($state, ActionService, DataService, UtilService){

    var self = this;

    this.deck = [
        ['A','club','&#9827;'],['K','club','&#9827;'],['Q','club','&#9827;'],['J','club','&#9827;'],['10','club','&#9827;'],['9','club','&#9827;'],['8','club','&#9827;'],['7','club','&#9827;'],['6','club','&#9827;'],['5','club','&#9827;'],['4','club','&#9827;'],['3','club','&#9827;'],['2','club','&#9827;'],
        ['A','diamond','&#9830;'],['K','diamond','&#9830;'],['Q','diamond','&#9830;'],['J','diamond','&#9830;'],['10','diamond','&#9830;'],['9','diamond','&#9830;'],['8','diamond','&#9830;'],['7','diamond','&#9830;'],['6','diamond','&#9830;'],['5','diamond','&#9830;'],['4','diamond','&#9830;'],['3','diamond','&#9830;'],['2','diamond','&#9830;'],
        ['A','heart','&#9829;'],['K','heart','&#9829;'],['Q','heart','&#9829;'],['J','heart','&#9829;'],['10','heart','&#9829;'],['9','heart','&#9829;'],['8','heart','&#9829;'],['7','heart','&#9829;'],['6','heart','&#9829;'],['5','heart','&#9829;'],['4','heart','&#9829;'],['3','heart','&#9829;'],['2','heart','&#9829;'],
        ['A','spade','&#9824;'],['K','spade','&#9824;'],['Q','spade','&#9824;'],['J','spade','&#9824;'],['10','spade','&#9824;'],['9','spade','&#9824;'],['8','spade','&#9824;'],['7','spade','&#9824;'],['6','spade','&#9824;'],['5','spade','&#9824;'],['4','spade','&#9824;'],['3','spade','&#9824;'],['2','spade','&#9824;']
    ];

    this.currentDeck = [];
    this.dealer = [];
    this.me = [];
    this.dealerTotal = 0;
    this.myTotal = 0;
    this.bet = 5;
    this.done = false;
    this.stayed = false;

    this.newDeck = function () {
        self.currentDeck = self.deck;
        console.log(self.currentDeck);
    };

    this.drawCard = function (hand, cards) {
        console.log(self.currentDeck.length);
        for (i = 0; i < cards; i++) {
            card = self.currentDeck.splice(UtilService.random(0,self.currentDeck.length -1), 1);
            self[hand].push(card[0]);
        }
    };

    this.deal = function () {
        if (self.bet > DataService.stats.credits) {
            alert("You don't have enough credits. Get out of here until you do!");
            ActionService.amenities();
            $state.go('amenities');
            return;
        }

        self.dealt = true;
        this.stayed = false;
        self.currentDeck = self.deck.slice();
        this.dealer = [];
        this.me = [];

        self.drawCard('dealer', 2);
        self.dealerTotal = self.getTotals('dealer');
        self.drawCard('me', 2);
        self.myTotal = self.getTotals('me');
        self.getTotals('me');

        if (self.dealerTotal===21 && self.myTotal===21) {
            alert('You push.');
        } else if (self.myTotal===21) {
            alert('Blackjack!!!');
            DataService.stats.credits += self.bet*1.5;
            this.dealt = false;
        }

    };

    this.hit = function (hand) {

        self.drawCard(hand, 1);
        if (hand==='dealer') {
            self.dealerTotal = self.getTotals(hand);
            if (self.dealerTotal > 21) {
                alert('Dealer busted!');
                DataService.stats.credits += self.bet;
                self.dealt = false;
            }
        } else {
            self.myTotal = self.getTotals(hand);
            if (self.myTotal > 21) {
                alert('You busted!');
                DataService.stats.credits -= self.bet;
                self.dealt = false;
            } else if (self.myTotal === 21) {
                alert('21! You should probably stay.');
            }
        }

    };

    this.stay = function () {
        self.stayed = true;

        while (self.dealerTotal < 17) {
            self.hit('dealer');
        }
        if (self.dealerTotal > 21 || self.dealerTotal < self.myTotal) {
            alert('You win!!!');
            DataService.stats.credits += self.bet;
            self.dealt = false;
        } else if (self.dealerTotal === self.myTotal) {
            alert('You push.');
            self.dealt = false;
        } else {
            alert('You lose!');
            DataService.stats.credits -= self.bet;
            self.dealt = false;
        }

    };

    this.getTotals = function (hand) {
        var total = 0;
        angular.forEach(self[hand], function(card) {
            if (isNaN(card[0])) {
                if (card[0]==='A'){
                    if (total + 11 > 21) {
                        total += 1;
                    } else {
                        total += 11;
                    }
                } else {
                    total += 10;
                }
            } else {
                total += parseInt(card[0]);
            }
        });
        console.log(total);
        return total;
    };

    this.raise = function () {
        var amt = 5;
        if (self.bet + amt > DataService.stats.credits) {
            alert("You don't have that much.");
        } else {
            self.bet += amt;
        }
    };

    this.lower = function () {
        var amt = 5;
        if (self.bet - amt < 5) {
            alert('Minimum bet is 5');
        } else {
            self.bet -= amt;
        }
    }

    this.doubleDown = function () {
        self.bet += self.bet;
        self.hit('me');
        if (self.myTotal < 21) {
            self.stay();
        };
    }

});