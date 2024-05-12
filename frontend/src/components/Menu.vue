<template>
  <a-breadcrumb>
    <a-breadcrumb-item>
      <template #droplist>
        <a-doption>create new txt</a-doption>
        <a-dsubmenu value="option-1">
          <template #default>open recent file</template>
          <template #content>
            <a-doption>Option 2-1</a-doption>
            <a-doption>Option 2-2</a-doption>
            <a-doption>Option 2-3</a-doption>
          </template>
          <template #footer>
            <div style="padding: 6px; text-align: center;">
              <a-button>More</a-button>
            </div>
          </template>
        </a-dsubmenu>
        <a-doption>Option 3</a-doption>
      </template>
      File
    </a-breadcrumb-item>
    <a-breadcrumb-item>
      <template #droplist>
        <a-doption>Option 1</a-doption>
        <a-dsubmenu value="option-1">
          <template #default>Option 2</template>
          <template #content>
            <a-doption>Option 2-1</a-doption>
            <a-doption>Option 2-2</a-doption>
            <a-doption>Option 2-3</a-doption>
          </template>
          <template #footer>
            <div style="padding: 6px; text-align: center;">
              <a-button>Click</a-button>
            </div>
          </template>
        </a-dsubmenu>
        <a-doption>Option 3</a-doption>
      </template>
      Edit
    </a-breadcrumb-item>
    <a-breadcrumb-item>
      <template #droplist>
        <a-doption>Option 1</a-doption>
        <a-dsubmenu value="option-1">
          <template #default>Option 2</template>
          <template #content>
            <a-doption>Option 2-1</a-doption>
            <a-doption>Option 2-2</a-doption>
            <a-doption>Option 2-3</a-doption>
          </template>
          <template #footer>
            <div style="padding: 6px; text-align: center;">
              <a-button>Click</a-button>
            </div>
          </template>
        </a-dsubmenu>
        <a-doption>Option 3</a-doption>
      </template>
      Selection
    </a-breadcrumb-item>
    <a-breadcrumb-item>
      <template #droplist>
        <a-doption>Option 1</a-doption>
        <a-dsubmenu value="option-1">
          <template #default>Option 2</template>
          <template #content>
            <a-doption>Option 2-1</a-doption>
            <a-doption>Option 2-2</a-doption>
            <a-doption>Option 2-3</a-doption>
          </template>
          <template #footer>
            <div style="padding: 6px; text-align: center;">
              <a-button>Click</a-button>
            </div>
          </template>
        </a-dsubmenu>
        <a-doption>Option 3</a-doption>
      </template>
      View
    </a-breadcrumb-item>
    <a-breadcrumb-item>
      <template #droplist>
        <a-doption>Option 1</a-doption>
        <a-dsubmenu value="option-1">
          <template #default>Option 2</template>
          <template #content>
            <a-doption>Option 2-1</a-doption>
            <a-doption>Option 2-2</a-doption>
            <a-doption>Option 2-3</a-doption>
          </template>
          <template #footer>
            <div style="padding: 6px; text-align: center;">
              <a-button>Click</a-button>
            </div>
          </template>
        </a-dsubmenu>
        <a-doption>Option 3</a-doption>
      </template>
      Go
    </a-breadcrumb-item>
    <a-breadcrumb-item>
      <template #droplist>
        <a-doption>Option 1</a-doption>
        <a-dsubmenu value="option-1">
          <template #default>Option 2</template>
          <template #content>
            <a-doption>Option 2-1</a-doption>
            <a-doption>Option 2-2</a-doption>
            <a-doption>Option 2-3</a-doption>
          </template>
          <template #footer>
            <div style="padding: 6px; text-align: center;">
              <a-button>Click</a-button>
            </div>
          </template>
        </a-dsubmenu>
        <a-doption>Option 3</a-doption>
      </template>
      Run
    </a-breadcrumb-item>
    <a-breadcrumb-item>
      <template #droplist>
        <a-doption>Option 1</a-doption>
        <a-dsubmenu value="option-1">
          <template #default>Option 2</template>
          <template #content>
            <a-doption>Option 2-1</a-doption>
            <a-doption>Option 2-2</a-doption>
            <a-doption>Option 2-3</a-doption>
          </template>
          <template #footer>
            <div style="padding: 6px; text-align: center;">
              <a-button>Click</a-button>
            </div>
          </template>
        </a-dsubmenu>
        <a-doption>Option 3</a-doption>
      </template>
      Help
    </a-breadcrumb-item>
    <a-breadcrumb-item>
      <template #droplist>
        <a-doption>Option 1</a-doption>
        <a-dsubmenu value="option-1">
          <template #default>Option 2</template>
          <template #content>
            <a-doption>Option 2-1</a-doption>
            <a-doption>Option 2-2</a-doption>
            <a-doption>Option 2-3</a-doption>
          </template>
          <template #footer>
            <div style="padding: 6px; text-align: center;">
              <a-button>Click</a-button>
            </div>
          </template>
        </a-dsubmenu>
        <a-doption>Option 3</a-doption>
      </template>
      Terminal
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      routes: [
        {
          path: '/',
          label: 'Home'
        },
        {
          path: '/channel',
          label: 'Channel',
          children: [
            {
              path: '/users',
              label: 'Users',
            },
            {
              path: '/permission',
              label: 'Permission',
            }
          ]
        },
        {
          path: '/news',
          label: 'News'
        },
      ],
      droplist: [
        {
          path: '/goods',
          label: 'Goods',
        },
        {
          path: '/wallet',
          label: 'Wallet',
        }
      ]
    }
  }
}
</script>
