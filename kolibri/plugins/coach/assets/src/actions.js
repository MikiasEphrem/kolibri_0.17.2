const coreApp = require('kolibri');
const coreActions = require('kolibri.coreVue.vuex.actions');
const getDefaultChannelId = require('kolibri.coreVue.vuex.getters').getDefaultChannelId;
const ConditionalPromise = require('kolibri.lib.conditionalPromise');
const router = require('kolibri.coreVue.router');

const ClassroomResource = coreApp.resources.ClassroomResource;
const LearnerGroupResource = coreApp.resources.LearnerGroupResource;
const MembershipResource = coreApp.resources.MembershipResource;

const ChannelResource = coreApp.resources.ChannelResource;
const FacilityUserResource = coreApp.resources.FacilityUserResource;
const Constants = require('./state/constants');

const logging = require('kolibri.lib.logging');
const values = require('lodash.values');


/* find the keys that differ between the old and new params */
function _diffKeys(newParams, oldParams) {
  if (!oldParams) {
    return Object.keys(newParams);
  }
  const diffKeys = [];
  Object.entries(newParams).forEach(([key, value]) => {
    if (oldParams[key] !== value) {
      diffKeys.push(key);
    }
  });
  return diffKeys;
}

/**
 * Title Helper
 */

function _managePageTitle(title) {
  return `Manage ${title}`;
}


// ================================
// CLASS LIST ACTIONS

function showClassListPage(store) {
  store.dispatch('CORE_SET_PAGE_LOADING', true);
  store.dispatch('SET_PAGE_NAME', Constants.PageNames.COACH_CLASS_LIST_PAGE);
  const classCollection = ClassroomResource.getCollection();
  classCollection.fetch().then(
    (classes) => {
      const pageState = {
        // classes: classes.map(_classState),
        classes,
      };
      store.dispatch('SET_PAGE_STATE', pageState);
      store.dispatch('CORE_SET_PAGE_LOADING', false);
      store.dispatch('CORE_SET_ERROR', null);
      store.dispatch('CORE_SET_TITLE', _managePageTitle('Coach'));
    },
    error => { coreActions.handleApiError(store, error); }
  );
}


// ================================
// RECENT ACTIONS

function showRecentPage(store, params) {
  store.dispatch('CORE_SET_PAGE_LOADING', true);
  store.dispatch('SET_PAGE_NAME', Constants.PageNames.COACH_RECENT_PAGE);
  const classCollection = ClassroomResource.getCollection();
  classCollection.fetch().then(
    (classes) => {
      const pageState = {
        // classes: classes.map(_classState),
        classes,
      };
      store.dispatch('SET_PAGE_STATE', pageState);
      store.dispatch('CORE_SET_PAGE_LOADING', false);
      store.dispatch('CORE_SET_ERROR', null);
      store.dispatch('CORE_SET_TITLE', _managePageTitle('Coach'));
    },
    error => { coreActions.handleApiError(store, error); }
  );
}


// ================================
// TOPICS ACTIONS

function showTopicsPage(store, params) {
  store.dispatch('CORE_SET_PAGE_LOADING', true);
  store.dispatch('SET_PAGE_NAME', Constants.PageNames.COACH_TOPICS_PAGE);
  const classCollection = ClassroomResource.getCollection();
  classCollection.fetch().then(
    (classes) => {
      const pageState = {
        // classes: classes.map(_classState),
        classes,
      };
      store.dispatch('SET_PAGE_STATE', pageState);
      store.dispatch('CORE_SET_PAGE_LOADING', false);
      store.dispatch('CORE_SET_ERROR', null);
      store.dispatch('CORE_SET_TITLE', _managePageTitle('Coach'));
    },
    error => { coreActions.handleApiError(store, error); }
  );
}


// ================================
// EXAMS ACTIONS

function showExamsPage(store, params) {
  store.dispatch('CORE_SET_PAGE_LOADING', true);
  store.dispatch('SET_PAGE_NAME', Constants.PageNames.COACH_EXAMS_PAGE);
  const classCollection = ClassroomResource.getCollection();
  classCollection.fetch().then(
    (classes) => {
      const pageState = {
        // classes: classes.map(_classState),
        classes,
      };
      store.dispatch('SET_PAGE_STATE', pageState);
      store.dispatch('CORE_SET_PAGE_LOADING', false);
      store.dispatch('CORE_SET_ERROR', null);
      store.dispatch('CORE_SET_TITLE', _managePageTitle('Coach'));
    },
    error => { coreActions.handleApiError(store, error); }
  );
}


// ================================
// LEARNERS ACTIONS

function showLearnersPage(store, params) {
  store.dispatch('CORE_SET_PAGE_LOADING', true);
  store.dispatch('SET_PAGE_NAME', Constants.PageNames.COACH_LEARNERS_PAGE);
  const classCollection = ClassroomResource.getCollection();
  classCollection.fetch().then(
    (classes) => {
      const pageState = {
        // classes: classes.map(_classState),
        classes,
      };
      store.dispatch('SET_PAGE_STATE', pageState);
      store.dispatch('CORE_SET_PAGE_LOADING', false);
      store.dispatch('CORE_SET_ERROR', null);
      store.dispatch('CORE_SET_TITLE', _managePageTitle('Coach'));
    },
    error => { coreActions.handleApiError(store, error); }
  );
}


// ================================
// GROUPS ACTIONS

function showGroupsPage(store, classId) {
  store.dispatch('CORE_SET_PAGE_LOADING', true);
  store.dispatch('SET_PAGE_NAME', Constants.PageNames.COACH_GROUPS_PAGE);

  const facilityPromise = FacilityUserResource.getCurrentFacility();
  const classPromise = ClassroomResource.getModel(classId).fetch();
  const classUsersPromise = FacilityUserResource.getCollection({ member_of: classId }).fetch({}, true);
  const groupPromise = LearnerGroupResource.getCollection({ parent: classId }).fetch();
  const groupUsersPromise = FacilityUserResource.getCollection({ member_of: 13 }).fetch({}, true);

  ConditionalPromise.all([facilityPromise, classPromise, classUsersPromise, groupPromise, groupUsersPromise]).only(
    coreActions.samePageCheckGenerator(store),
    ([facility, classModel, classUsers, groups, groupUsers]) => {
      const pageState = {
        facilityId: facility[0],
        class: classModel,
        classUsers,
        groups,
        groupUsers,
        modalShown: false,
      };
      store.dispatch('SET_PAGE_STATE', pageState);
      store.dispatch('CORE_SET_PAGE_LOADING', false);
      store.dispatch('CORE_SET_ERROR', null);
      store.dispatch('CORE_SET_TITLE', _managePageTitle('Coach'));
    },
    error => {
      coreActions.handleError(store, error);
    }
  );
}

function createGroup(store, classId, groupName) {
  const groupPayload = {
    parent: classId,
    name: groupName,
  };
  return new Promise((resolve, reject) => {
    LearnerGroupResource.createModel(groupPayload).save().then(
      group => {
        store.dispatch('ADD_GROUP', group);
      },
      error => reject(error)
    );
  });
}

function renameGroup(store, classId, groupId, newGroupName) {
  const groupPayload = {
    name: newGroupName,
  };
  return new Promise((resolve, reject) => {
    LearnerGroupResource.getModel(groupId).save(groupPayload).then(
      updatedGroup => {
        store.dispatch('UPDATE_GROUP', groupId, updatedGroup);
      },
      error => reject(error)
    );
  });
}

function deleteGroup(store, classId, groupId) {
  // remove all users from that group
  // remove group from class
  // then dispatch
  const groupPayload = {
    parent: classId,
    id: groupId,
  };
  return new Promise((resolve, reject) => {
    LearnerGroupResource.createModel(groupPayload).save().then(
      group => {
        store.dispatch('DELETE_GROUP', group);
      },
      error => reject(error)
    );
  });
}

function addUserToGroup(store, groupId, userId) {
  const membershipPayload = {
    collection: groupId,
    user: userId,
  };
  return new Promise((resolve, reject) => {
    MembershipResource.createModel(membershipPayload).save().then(
      groupUser => {
        console.log(groupUser);
      },
      error => reject(error)
    );
  });
}

function removeUserfromGroup(store, groupId, userId) {
  const membershipPayload = {
    collection: groupId,
    user: userId,
  };
  return new Promise((resolve, reject) => {
    MembershipResource.getModel(membershipPayload).delete().then(
      user => {
        store.dispatch('REMOVE_USER_FROM_CLASS', userId);
      },
      error => reject(error)
    );
  });
}

function showCoachRoot(store) {
  store.dispatch('CORE_SET_PAGE_LOADING', false);
  store.dispatch('SET_PAGE_NAME', Constants.PageNames.COACH_ROOT);
}


function redirectToChannelReport(store, params) {
  const channelId = params.channel_id;
  const channelListPromise = ChannelResource.getCollection({}).fetch();

  ConditionalPromise.all([channelListPromise]).only(
    coreActions.samePageCheckGenerator(store),
    ([channelList]) => {
      if (!(channelList.some((channel) => channel.id === channelId))) {
        router.getInstance().replace({ name: Constants.PageNames.CONTENT_UNAVAILABLE });
        return;
      }
      coreActions.setChannelInfo(store, channelId).then(
        () => {
          router.getInstance().replace({ name: Constants.PageNames.REPORTS_NO_QUERY });
        }
      );
    },
    error => {
      coreActions.handleError(store, error);
    }
  );
}


function redirectToDefaultReport(store, params) {
  store.dispatch('CORE_SET_PAGE_LOADING', true);
  store.dispatch('SET_PAGE_NAME', Constants.PageNames.REPORTS_NO_QUERY);

  const channelListPromise = ChannelResource.getCollection({}).fetch();
  const facilityIdPromise = FacilityUserResource.getCurrentFacility();

  ConditionalPromise.all([channelListPromise, facilityIdPromise]).only(
    coreActions.samePageCheckGenerator(store),
    ([channelList, facilityId]) => {
      // If no channels exist
      if (channelList.length === 0) {
        router.getInstance().replace({ name: Constants.PageNames.CONTENT_UNAVAILABLE });
        return;
      }
      /* get current channelId */
      const channelId = getDefaultChannelId(channelList);

      /* get contentScopeId for root */
      const contentScopeId = channelList.find((channel) => channel.id === channelId).root_pk;

      /* get userScopeId for facility */
      const userScopeId = facilityId[0];
      router.getInstance().replace({
        name: Constants.PageNames.REPORTS,
        params: {
          channel_id: channelId,
          content_scope: Constants.ContentScopes.ROOT,
          content_scope_id: contentScopeId,
          user_scope: Constants.UserScopes.FACILITY,
          user_scope_id: userScopeId,
          all_or_recent: Constants.AllOrRecent.ALL,
          view_by_content_or_learners: Constants.ViewBy.CONTENT,
          sort_column: Constants.TableColumns.NAME,
          sort_order: Constants.SortOrders.NONE,
        },
      });
    },

    error => {
      coreActions.handleError(store, error);
    }
  );
}


function showReport(store, params, oldParams) {
  /* get params from url. */
  const channelId = params.channel_id;
  const contentScope = params.content_scope;
  const contentScopeId = params.content_scope_id;
  const userScope = params.user_scope;
  const userScopeId = params.user_scope_id;
  const allOrRecent = params.all_or_recent;
  const viewByContentOrLearners = params.view_by_content_or_learners;
  const sortColumn = params.sort_column;
  const sortOrder = params.sort_order;


  /* check if params are semi-valid. */
  if (!(values(Constants.ContentScopes).includes(contentScope)
    && values(Constants.UserScopes).includes(userScope)
    && values(Constants.AllOrRecent).includes(allOrRecent)
    && values(Constants.ViewBy).includes(viewByContentOrLearners)
    && values(Constants.TableColumns).includes(sortColumn)
    && values(Constants.SortOrders).includes(sortOrder))) {
    /* if invalid params, just throw an error. */
    coreActions.handleError(store, 'Invalid report parameters.');
    return;
  }

  const diffKeys = _diffKeys(params, oldParams);

  store.dispatch('SET_PAGE_NAME', Constants.PageNames.REPORTS);

  // these don't require updates from the server
  const localUpdateParams = ['sort_column', 'sort_order'];
  if (diffKeys.every(key => localUpdateParams.includes(key))) {
    store.dispatch('SET_SORT_COLUMN', sortColumn);
    store.dispatch('SET_SORT_ORDER', sortOrder);
    return;
  }

  const resourcePromise = require('./resourcePromise');
  const URL_ROOT = '/coach/api';
  const promises = [];

  // REPORT
  if (userScope === Constants.UserScopes.USER && contentScope === Constants.ContentScopes.CONTENT) {
    promises.push([]); // don't retrieve a report for a single-user, single-item page
  } else {
    let reportUrl = `${URL_ROOT}/${channelId}/${contentScopeId}/${userScope}/${userScopeId}`;
    if (allOrRecent === Constants.AllOrRecent.RECENT) {
      reportUrl += '/recentreport/';
    } else if (viewByContentOrLearners === Constants.ViewBy.CONTENT) {
      reportUrl += '/contentreport/';
    } else if (viewByContentOrLearners === Constants.ViewBy.LEARNERS) {
      reportUrl += '/userreport/';
    } else {
      logging.error('unhandled input parameters');
    }
    promises.push(resourcePromise(reportUrl));
  }


  // CONTENT SUMMARY
  const contentSummaryUrl =
    `${URL_ROOT}/${channelId}/${userScope}/${userScopeId}/contentsummary/${contentScopeId}/`;
  promises.push(resourcePromise(contentSummaryUrl));

  // USER SUMMARY
  if (userScope === Constants.UserScopes.USER) {
    const userSummaryUrl
      = `${URL_ROOT}/${channelId}/${contentScopeId}/usersummary/${userScopeId}/`;
    promises.push(resourcePromise(userSummaryUrl));
  } else {
    promises.push({}); // don't retrieve a summary for a group of users
  }

  // CHANNELS
  const channelPromise = coreActions.setChannelInfo(store);
  promises.push(channelPromise);

  // API response handlers
  Promise.all(promises).then(([report, contentSummary, userSummary]) => {
    // save URL params to store
    store.dispatch('SET_CHANNEL_ID', channelId);
    store.dispatch('SET_CONTENT_SCOPE', contentScope);
    store.dispatch('SET_CONTENT_SCOPE_ID', contentScopeId);
    store.dispatch('SET_USER_SCOPE', userScope);
    store.dispatch('SET_USER_SCOPE_ID', userScopeId);
    store.dispatch('SET_ALL_OR_RECENT', allOrRecent);
    store.dispatch('SET_VIEW_BY_CONTENT_OR_LEARNERS', viewByContentOrLearners);
    store.dispatch('SET_SORT_COLUMN', sortColumn);
    store.dispatch('SET_SORT_ORDER', sortOrder);

    // save results of API request
    store.dispatch('SET_TABLE_DATA', report);
    store.dispatch('SET_CONTENT_SCOPE_SUMMARY', contentSummary);
    store.dispatch('SET_USER_SCOPE_SUMMARY', userSummary);
    store.dispatch('CORE_SET_PAGE_LOADING', false);

    const titleElems = ['Coach Reports'];
    if (userScope === Constants.UserScopes.USER) {
      titleElems.push(`${userSummary.full_name}`);
    } else if (userScope === Constants.UserScopes.FACILITY) {
      titleElems.push('All learners');
    }
    titleElems.push(`${contentSummary.title}`);
    if (allOrRecent === Constants.AllOrRecent.RECENT) {
      titleElems.push('Recent');
    } else if (viewByContentOrLearners === Constants.ViewBy.CONTENT) {
      titleElems.push('Contents');
    } else if (viewByContentOrLearners === Constants.ViewBy.LEARNERS) {
      titleElems.push('Learners');
    }
    store.dispatch('CORE_SET_TITLE', titleElems.join(' - '));
  },
    error => { coreActions.handleError(store, error); }
  );
}

function showContentUnavailable(store) {
  store.dispatch('SET_PAGE_NAME', Constants.PageNames.CONTENT_UNAVAILABLE);
  store.dispatch('CORE_SET_PAGE_LOADING', false);
  store.dispatch('CORE_SET_TITLE', 'Content Unavailable');
}

function displayModal(store, modalName) {
  store.dispatch('SET_MODAL', modalName);
}


module.exports = {
  showClassListPage,
  showRecentPage,
  showTopicsPage,
  showExamsPage,
  showLearnersPage,
  showGroupsPage,
  createGroup,
  renameGroup,
  deleteGroup,
  addUserToGroup,
  removeUserfromGroup,
  displayModal,
  showCoachRoot,
  redirectToChannelReport,
  redirectToDefaultReport,
  showReport,
  showContentUnavailable,
};
