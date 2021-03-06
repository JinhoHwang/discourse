import { ajax } from 'discourse/lib/ajax';

const WatchedWord = Discourse.Model.extend({
  save() {
    return ajax("/admin/watched_words" + (this.id ? '/' + this.id : '') + ".json", {
      type: this.id ? 'PUT' : 'POST',
      data: {word: this.get('word'), action_key: this.get('action')},
      dataType: 'json'
    });
  },

  destroy() {
    return ajax("/admin/watched_words/" + this.get('id') + ".json", {type: 'DELETE'});
  }
});

WatchedWord.reopenClass({
  findAll() {
    return ajax("/admin/watched_words").then(function (list) {
      const actions = {};
      list.words.forEach(s => {
        if (!actions[s.action]) { actions[s.action] = []; }
        actions[s.action].pushObject(WatchedWord.create(s));
      });

      list.actions.forEach(a => {
        if (!actions[a]) { actions[a] = []; }
      });

      return Object.keys(actions).map(function(n) {
        return Ember.Object.create({nameKey: n, name: I18n.t('admin.watched_words.actions.' + n), words: actions[n], count: actions[n].length});
      });
    });
  }
});

export default WatchedWord;
