<template>
    <div>

        <div class="page-header mb-4 p-4">
            <h1 class="d-flex align-items-center">
                <mc-icon :skill="'woodcutting'" class="d-inline-block me-2"></mc-icon>
                Welcome to Idle Craft
            </h1>
        </div>
        <div class="container">
            <div class="row">
                <div class="col-12 col-lg-8">
                    <div class="card mb-3">
                        <div class="card-body">
                            <h2>Welcome to IdleCraft Alpha</h2>
                            <p>The Alpha test is here! Welcome. This phase of the game is to test features, make sure
                                there is nothing critical that can go wrong in further stages.</p>

                            <p>There will be a wipe after this phase, and again after beta ends. Then the launch will
                                happen, there will be no more wipes after this</p>

                            <p>We are always on the lookout for new ideas and suggestions so please hop into our <a
                                    href="https://discord.gg/idlecraft" target="_blank" nofollow>Discord</a>
                                and have a chat</p>

                            <p>Alpha will end <strong>October 30th</strong></p>
                            <p>BETA will begin <strong>November 8th</strong></p>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-4">
                    <GameTip force hide-icon homepage/>

                    <div class="card mb-3">
                        <div class="card-header">Friends ({{ friends.length }})</div>
                        <ul>
                            <li v-for="(rel, index) in friends" :key="index">
                                {{ rel.other_user.username }}
                            </li>
                        </ul>
                    </div>

                    <div class="card">
                        <div class="card-header">Blocklist ({{ blocked.length }})</div>
                        <ul>
                            <li v-for="(rel, index) in blocked" :key="index">
                                {{ rel.other_user.username }}
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>

import GameTip from "../../components/GameTip";
import McIcon from "../../components/McIcon";
import store from '../../store'

export default {
  name: 'Home',
  components: {McIcon, GameTip},
  data: () => {
    return {
      state: store.state
    }
  },
  methods: {},
  computed: {
    friends() {
      return this.state.user.relationships.filter(r => r.type === 'friend')
    },
    blocked() {
      return this.state.user.relationships.filter(r => r.type === 'block')
    },
  },
  sockets: {}
}
</script>
