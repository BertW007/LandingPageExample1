import $ from "jquery";
import '../scss/main.scss';

function appInit(q,id) {
  const domID = id||'app',
        app = q(`#${domID}`),
        listData = [
          'JQuery',
          'Sass/Autoprefixer',
          'ExtractTextPlugin',
          'Babel/ES6',
          'Webpack',
          'Webpack-Dev-Server'
        ],
        headerData = ':: JS Boilerplate ::';

  const createList = (data) => {
    const list = q('<div>'),
          wrapper = q('<div>'),
          ul = q('<ul>'),
          header = q('<h1>');

    list.addClass('list');
    wrapper.addClass('wrapper');
    header.text(headerData);
    wrapper.append(header);

    data.forEach((item) => {
      let listItem = q('<li>');
      listItem.text(item);
      ul.append(listItem);
    });

    wrapper.append(ul);
    list.append(wrapper);

    return list;
  }

  const createHeader = (data) => {
    const header = q('<h1>');
    header.text(data);
    return header;
  }

  const render = (args) => {
    args.forEach((arg) => {
      app.append(arg);
    });
  }

  return {
    renderView: () => {
      const list = createList(listData);
      render(
        [list]
      );
    }
  }
}

const App = appInit($);
App.renderView();
